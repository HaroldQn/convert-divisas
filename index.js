document.addEventListener("DOMContentLoaded", function () {
  const select_1 = document.getElementById("select_1");
  const select_2 = document.getElementById("select_2");
  const input_1 = document.getElementById("input_1");
  const input_2 = document.getElementById("input_2");

  // URLS : API 'https://fxratesapi.com/docs'
  const URLS = {
    Currencys: "https://api.fxratesapi.com/currencies",
    Convert: "https://api.fxratesapi.com/latest",
  };

  async function getDivisas() {
    try {
      const response = await fetch(URLS.Currencys);
      const data = await response.json();
      Object.values(data).forEach(({ code, symbol_native, name }) => {
        const option = `<option value="${code}">${code} ${symbol_native} - ${name}</option>`;
        select_1.innerHTML += option;
        select_2.innerHTML += option;
      });

      select_1.value = "USD";
      select_2.value = "EUR";
      await updateConversion();
    } catch (error) {
      console.error(error);
    }
  }

  async function convert(base, currencies, amount = 1) {
    try {
      const url = `${URLS.Convert}?base=${base}&currencies=${currencies}&resolution=1m&amount=${amount}&places=6&format=json`;
      const response = await fetch(url);
      const data = await response.json();
      const rate = data.rates[currencies];
      return rate;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  // Convertidor del primer Select
  async function updateConversion() {
    const base = select_1.value;
    const currencie = select_2.value;
    const amount = parseFloat(input_1.value) || 1;

    const rate = await convert(base, currencie, amount);
    if (rate !== null) {
      input_2.value = (amount * rate).toFixed(2);
    }
  }


  //Convertir del segundo Select en reversa
  async function reverseConversion() {
    const base = select_2.value;
    const currencie = select_1.value;
    const amount = parseFloat(input_2.value) || 1;

    const rate = await convert(base, currencie, amount);
    if (rate !== null) {
      input_1.value = (amount * rate).toFixed(2);
    }
  }

  // Eventos
  select_1.addEventListener("change", updateConversion);
  select_2.addEventListener("change", updateConversion);
  input_1.addEventListener("input", updateConversion);
  input_2.addEventListener("input", reverseConversion);

  getDivisas();
});
