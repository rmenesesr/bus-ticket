let alerts = [];
var valor;
var cities = [];
leerCookie('token');

function leerCookie(nombre) {
  let lista = document.cookie.split(";")
  for (i in lista) {
    let busca = lista[i].search(nombre)
    if (busca > -1) {token=lista[i]}
  }
  let igual = token.indexOf("=")
  valor = token.substring(igual+1)
}

function recibeAlert() {
axios.get('https://serene-shelf-99762.herokuapp.com/alerts', { 
  headers: {'Authorization': valor,},
}).then((response) => {
  alerts = response.data;
  createTableAlert();
}).catch(function (error) {
  console.log(error);
});
}

function createTableAlert() {
  const alert = document.getElementById("alert");
  for (datos of alerts) { 
    alert.innerHTML += 
    `<tr id="${datos.id}">
      <td>${datos.name}</td>
      <td>${datos.departure_city.name}</td>
      <td>${datos.destination_city.name}</td>
      <td>${datos.service_stars}</td>
      <td>${datos.price}</td>
      <th><button id="see">See</th>
      <th><button id="modify" onclick="modifyAlert(${datos.id})">Mod</th>
      <th><button id="delete" onclick="deleteAlert(${datos.id})">Del</th>
    </tr>`
  }
}

function deleteAlert(id) {
  const confirmation = confirm("Are you sure want delete????");
  if(confirmation !== true) return;
  axios.delete('https://serene-shelf-99762.herokuapp.com/alerts' + '/' + id, {
    headers: {'Authorization': valor,},
  }).then((response) => {
    const table = document.getElementById("alerts-table");
    const rowindex = document.getElementById(id).rowIndex;
    table.deleteRow(rowindex);
  }).catch(function (error) {
    console.log(error);
  });
}

function modifyAlert(alertId) {
  const data = alerts.find(alert => alert.id == alertId);
  document.getElementById("id").value = data.id;
  document.getElementById("name").value = data.name;
  document.getElementById("precio").value = data.price;
  document.getElementById("clase").value = data.service_stars;
  modifyDepCity("city-origen");
  modifyDepCity("city-destino");
  document.getElementById("edit-alert").addEventListener("submit", function(e) {
    e.preventDefault();
    sendAlert(e.target.getAttribute("id"));
  });
}  

function modifyDepCity(city) {
  let ciudad = city;
  axios.get('https://serene-shelf-99762.herokuapp.com/cities',  {
    headers: {'Authorization': valor,},
    }).then((response) => {
        for (cities of response.data){
          if (ciudad == "city-origen") {
            createOptionDep(ciudad, cities.name, cities.id);
          }else{
            createOptionDes(ciudad, cities.name, cities.id);
          }
      }
    }).catch(function (error) {
      console.log(error);
    });
  }
   
function sendAlert(formId) {
  const form = document.getElementById(formId);
  const alertId = form.elements.id.value;
  console.log("lalala", alertId);
  let depcity = document.getElementById("city-origen"); 
  let descity = document.getElementById("city-destino"); 
  let alerta = depcity[depcity.selectedIndex].innerHTML;
  let headers = 
  axios.put('https://serene-shelf-99762.herokuapp.com/alerts/' + alertId, {
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': valor },
    body: {
      alert: {
        name: form.elements.name.value,
        departure_city_id: depcity.value,
        destination_city_id: descity.value,
        service_stars: form.elements.clase.value,
        price: form.elements.precio.value
  
        }},
  }).then((response) => {
    console.log(response.status);
  }).catch(error => {
    console.log(error);
  })
}

recibeAlert();

function createOptionDep(cityId, name, id) {
  const option = document.createElement('option');
  option.text = name;
  option.value = id;
  if (option.value == `${datos.departure_city.id}`) {
    option.selected = true;
  } else { 
    option.selected = false;
  }
  document.getElementById(cityId).appendChild(option); 
}

function createOptionDes(cityId, name, id) {
  const option = document.createElement('option');
  option.text = name;
  option.value = id;
  if (option.value == `${datos.destination_city.id}`) {
    option.selected = true;
  } else { 
    option.selected = false;
  }
  document.getElementById(cityId).appendChild(option); 
}

document.getElementById("botom").addEventListener("click", function() {
  window.history.back(1);
});
