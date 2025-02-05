import { ref, computed, onBeforeMount } from "vue";
import { useCategoriasStore } from "@/stores/categoriasStore";
import { useFiltrosStore } from "@/stores/filtrosStore";
import { useUserStore } from "@/stores/user";
import { useContasStore } from "@/stores/contasStore";

import * as txml from "txml";

import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

export function useFilesParser(
  tableData,
  submitted,
  displayDocDialog,
  verificouCategorias
) {
  const categoriasStore = useCategoriasStore();

  const handleFileUpload = (event) => {
    /* const tableData = ref([]);
    const submitted = ref(false);
    const displayDocDialog = ref(false);
    const verificouCategorias = ref(false);
 */
    // a depender da extensao do arquivo, chama a funcao correspondente para tratar o arquivo
    const file = event.files[0];
    const ext = file.name.split(".").pop();
    if (ext == "csv") {
      handleCSVUpload(event);
    } else if (ext == "ofx") {
      handleOFXUpload(event);
    } else if (ext == "pdf") {
      handlePDFUpload(event);
    }

    console.log("tableData");
    console.log(tableData.value);
    verificouCategorias.value = false;

    submitted.value = false;
    displayDocDialog.value = true;
  };

  const handleCSVUpload = (event) => {
    console.log(event.files[0]);

    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target.result;
      const rows = contents.split("\r\n");
      const headers = rows[0].split(",");

      const data = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i].split(",");
        const rowData = {};
        for (let j = 0; j < row.length; j++) {
          const cell = row[j];
          if (headers[j] == "valorbrl") {
            rowData["valor"] = cell.replace(".", ",");
          } else {
            rowData[headers[j]] = cell;
          }
        }
        data.push(rowData);
      }
      tableData.value = data;
    };
    reader.readAsText(file);
  };

  const handlePDFUpload = async (event) => {
    const file = event.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const pdfData = new Uint8Array(e.target.result);
      const loadingTask = pdfjsLib.getDocument({ data: pdfData });
      const pdfDoc = await loadingTask.promise;
      const numPages = pdfDoc.numPages;

      let extractedText = "";

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        extractedText += pageText + "\n";
      }

      const start = extractedText.indexOf("Detalhes da fatura");
      const end = extractedText.indexOf("Subtotal");
      if (start === -1 || end === -1) {
        console.error('Seção "Detalhes da fatura" não encontrada no PDF.');
        return;
      }

      const detailsText = extractedText.substring(start, end).trim();
      const invoiceData = processInvoiceText(detailsText);
      console.log("Saldo da Fatura Anterior:", invoiceData.saldoFaturaAnterior);
      console.log("Itens da Fatura:", invoiceData.itensFatura);

      tableData.value = invoiceData.itensFatura; // Preenche a tableData
    };

    reader.readAsArrayBuffer(file);
  };

  const processInvoiceText = (text) => {
    const results = {
      saldoFaturaAnterior: null,
      itensFatura: [],
    };

    // Regex para o saldo da fatura anterior
    const saldoAnteriorRegex = /SALDO FATURA ANTERIOR\s+BR\s+([\d,.]+)/;

    // Regex para itens da fatura
    const itensRegex = /(\d{2}\/\d{2})\s+(.+?)\s+BR\s+(-?[\d,.]+)/g;

    // Extrair saldo da fatura anterior
    const saldoMatch = text.match(saldoAnteriorRegex);
    if (saldoMatch) {
      const saldoValue = parseFloat(saldoMatch[1].replace(",", "."));
      results.saldoFaturaAnterior = saldoValue;
      /* results.itensFatura.push({
          date: '',
          descricao: 'Saldo da Fatura Anterior',
          valor: saldoValue,
      }); */
    }

    // Extrair itens da fatura
    let match;
    while ((match = itensRegex.exec(text)) !== null) {
      const [_, date, description, value] = match;
      results.itensFatura.push({
        date: date.trim(),
        descricao: description.trim(),
        valor: parseFloat(value.replace(",", ".")),
      });
    }

    return results;
  };

  const handleOFXUpload = (event) => {
    // console.log(event.files[0])
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const ofxString = e.target.result;
      const objtree = txml.parse(ofxString);
      const transacoes =
        objtree[1].children[1].children[0].children[2].children[2].children;
      console.log(transacoes);

      /* todo */
      //const headers = ['descricao', 'parcela', 'cidade', 'pais', 'valorusd', 'valorbrl']
      const headers = ["date", "descricao", "valorbrl"];
      console.log(headers);
      const data = [];
      for (let i = 1; i < transacoes.length; i++) {
        if (transacoes[i].tagName == "STMTTRN") {
          console.log(transacoes[i]);
          const rowData = {};

          const date = transacoes[i].children[1].children[0];
          rowData["ano"] = date.substring(0, 4);
          rowData["mes"] = date.substring(4, 6);
          rowData["dia"] = date.substring(6, 8);
          rowData["date"] =
            rowData["dia"] + "/" + rowData["mes"] + "/" + rowData["ano"];
          rowData["valor"] = transacoes[i].children[2].children[0];
          rowData["valor"] = rowData["valor"].replace(".", ",");
          // rowData['valor'] = 'R$ ' + rowData['valor']
          rowData["id"] = transacoes[i].children[3].children[0];
          rowData["descricao"] = transacoes[i].children[4].children[0];
          rowData["tipo"] = transacoes[i].children[0].children[0];
          rowData["categoria"] = {};
          data.push(rowData);
        }
      }
      tableData.value = data;
    };
    reader.readAsText(file);
  };

  const verificaTodosOsFiltros = () => {
    console.log("verificando todos os filtros");
    verificouCategorias.value = true;
    for (let i = 0; i < tableData.value.length; i++) {
      const transacao = tableData.value[i];
      if (transacao.descricao) {
        tableData.value[i]["selectedCateg"] = false;
        //zera as categorias
        tableData.value[i]["categoria"] = {};
        verificarFiltrosDaTransacao(categoriasStore.categorias, i);
      }
    }
  };

  // percorre recursivamente a arvore de categorias e verifica se algum filtro se aplica a transacao

  const verificarFiltrosDaTransacao = (categorias, index) => {
    console.log("verificando filtros");
    categorias.forEach((categoria) => {
      console.log("categoria");
      console.log(categoria);
      if (categoria.filtros) {
        categoria.filtros.forEach((filtro) => {
          if (verificarFiltro(filtro, index)) {
            console.log("filtro aplicado");
            console.log(filtro);
            tableData.value[index]["categoria"] = { [categoria.key]: true };
            console.log(tableData.value[index]);
          }
        });
      }
      if (categoria.children) {
        verificarFiltrosDaTransacao(categoria.children, index);
      }
    });
    console.log(
      "verifica se tableData.value[index].categoria tem alguma chave"
    );
  };

  const verificarFiltro = (filtro, index) => {
    var transacao = tableData.value[index];
    var cabeOFiltro = true;
    filtro.criteriosDoFiltro.forEach((criterio) => {
      if (criterio.tipoFiltro == "Valor") {
        if (criterio.valorMaiorque) {
          if (transacao.valor < criterio.valorMaiorque) {
            cabeOFiltro = false;
          }
        }
        if (criterio.valorMenorque) {
          if (transacao.valor > criterio.valorMenorque) {
            cabeOFiltro = false;
          }
        }
      } else if (criterio.tipoFiltro == "Data") {
        if (criterio.diaMaiorQue) {
          if (transacao.dia < criterio.diaMaiorQue) {
            cabeOFiltro = false;
          }
        }
        if (criterio.diaMenorQue) {
          if (transacao.dia > criterio.diaMenorQue) {
            cabeOFiltro = false;
          }
        }
      } else if (criterio.tipoFiltro == "Descrição") {
        /* console.log('filtroDescricao');
          console.log(criterio.filtroDescricao);
          console.log(transacao); */
        if (criterio.filtroDescricao) {
          if (!transacao.descricao.includes(criterio.filtroDescricao)) {
            cabeOFiltro = false;
          }
        }
      }
    });
    return cabeOFiltro;
  };

  onBeforeMount(() => {});

  return {
    handleFileUpload,
    verificaTodosOsFiltros,
  };
}
