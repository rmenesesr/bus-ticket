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
  headers: {'Authorization': valor}
}).then((response) => {
  alerts = response.data;
  createTableAlert();
}).catch(function (error) {
  console.log(error);
});
}

function createTableAlert() {
  document.getElementById("loading").style.display = "none";
  const alert = document.getElementById("alert");
    for (datos of alerts) { 
      alert.innerHTML += 
      `<tr id="${datos.id}">
        <td>${datos.name}</td>
        <td>${datos.departure_city.name}</td>
        <td>${datos.destination_city.name}</td>
        <td>${datos.service_stars}</td>
        <td>${datos.price}</td>
        <td><button id="see" onclick="showAlert(${datos.id})">See</td>
        <td><button id="modify" onclick="modifyAlert(${datos.id}, ${datos.departure_city.id}, ${datos.destination_city.id} )">Mod</td>
        <th><button id="delete" onclick="deleteAlert(${datos.id})">Del</th>
      </tr>`
    }
}

function showAlert(alertId) {
  const data = alerts.find(alert => alert.id == alertId);
  document.getElementById("edit").style.display="none";
  document.getElementById("view").style.display="block";
  document.getElementById("seeName").innerHTML = data.name;
  document.getElementById("seeOrigen").innerHTML = data.departure_city.name;
  document.getElementById("seeDestino").innerHTML = data.destination_city.name;
  document.getElementById("seeClase").innerHTML = data.service_stars;
  document.getElementById("seePrecio").innerHTML = data.price;

  Highcharts.getJSON('https://www.highcharts.com/samples/data/aapl-c.json', function (data) {
  // Create the chart
  Highcharts.stockChart('container', {
    rangeSelector: {
      selected: 1
    },

    title: {
      text: data.name
    },

    series: [{
      name: 'AAPL',
      data: data,
      tooltip: {
        valueDecimals: 2
      }
    }]
  });
});
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

function modifyAlert(alertId, depCity, descity) {
  document.getElementById("edit").style.display="block";
  document.getElementById("view").style.display="none";
  const data = alerts.find(alert => alert.id == alertId);
  document.getElementById("id").value = data.id;
  document.getElementById("name").value = data.name;
  document.getElementById("precio").value = data.price;
  document.getElementById("clase").value = data.service_stars;
  modifyDepCity("city-origen", depCity);
  modifyDepCity("city-destino", descity);
  let form = document.querySelector('#tbody');
  document.getElementById("edit-alert").addEventListener("submit", function(e) {
    e.preventDefault();
    sendAlert(e.target.getAttribute("id"));
  });
}  

function modifyDepCity(city, cityId) {
  let ciudad = city;
  axios.get('https://serene-shelf-99762.herokuapp.com/cities', {
    headers: {'Authorization': valor}
    }).then((response) => {
        for (cities of response.data){
          if (ciudad == "city-origen") {
            createOptionDep(ciudad, cities.name, cities.id, cityId);
          }else{
            createOptionDes(ciudad, cities.name, cities.id, cityId);
          }
      }
    }).catch(function (error) {
      console.log(error);
    });
  }
   
function sendAlert(formId) {
  const form = document.getElementById(formId);
  const alertId = form.elements.id.value;
  let depcity = document.getElementById("city-origen"); 
  let descity = document.getElementById("city-destino"); 
  let alerta = depcity[depcity.selectedIndex].innerHTML;
  let headers = 
  axios.put('https://serene-shelf-99762.herokuapp.com/alerts/' + alertId, 
  {
    alert: {
        name: form.elements.name.value,
        departure_city_id: depcity.value,
        destination_city_id: descity.value,
        service_stars: form.elements.clase.value,
        price: form.elements.precio.value
    }  
  },
    {
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': valor },
    }
  ).then((response) => {
    location.reload();
    recibeAlert();
    console.log(response.status);
  }).catch(error => {
    console.log(error);
  })
}

recibeAlert();

function createOptionDep(city, name, id, cityId) {
  const option = document.createElement('option');
  option.text = name;
  option.value = id;
  if (option.value == cityId) {
    
    option.selected = true;
  } else { 
    option.selected = false;
  }
  document.getElementById(city).appendChild(option); 
}

function createOptionDes(city, name, id, cityId) {
  const option = document.createElement('option');
  option.text = name;
  option.value = id;
  if (option.value == cityId) {
    
    option.selected = true;
  } else { 
    option.selected = false;
  }
  document.getElementById(city).appendChild(option); 
}

document.getElementById("botom").addEventListener("click", function() {
  window.history.back(1);
});
