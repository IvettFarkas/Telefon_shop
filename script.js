function renderTelefonok() {
    let telefonHTML = "";
    let telefonLista = document.getElementById("telefon-lista");
    let xhr = new XMLHttpRequest();
    console.log(xhr);
  
    //xhr.open('GET', 'http://localhost:3000/telefonok', true);

    xhr.onload = function() {

        if (xhr.status === 200) {
            console.log(xhr.responseText);
            let telefonok = JSON.parse(xhr.responseText); 
            console.log(telefonok);
            telefonok.forEach(function(csoki) {
                console.log(telefon.id);
                console.log(telefon.nev);
                telefonHTML += `
                    <div class="col">
                        <div class="${telefon.raktaron ? "bg-success" : "bg-danger"} m-2 p-2">
                            <h2>${telefon.nev}</h2>
                            <p>A termék ára: ${telefon.ara} Ft</p>
                            <button class="btn btn-danger" onclick="torles(${telefon.id})">Törlés</button>
                            <button class="btn btn-primary" onclick="modositas(${telefon.id})">Módosítás</button>
                        </div>
                    </div>
                `;
            });

            telefonLista.innerHTML = telefonHTML;
        } else {
            console.error('Hiba történt az adatok betöltésekor:', xhr.status, xhr.statusText);
           
        }
    };

    xhr.send();
}

document.getElementById('ujtermek').onclick = function () {
    let newFormHTML = `
        <h4>Áru hozzáadása:</h4>
        <form id="uj-telefon" class="p-5">
            <label class="w-100">
                <h5>Termék neve:</h5>
                <input class="form-control" type="text" name="nev">
            </label>
            <label class="w-100">
                <h5>Termék ára:</h5>
                <input class="form-control" type="number" name="ara">
            </label>
            <label>
                <h5>Van raktáron?</h5> 
                <input type="checkbox" name="raktaron">
            </label>
            <br>
            <button class="btn btn-success" type="submit">Küldés</button>
        </form>
    `;

    let ujElem = document.getElementById('uj');
    ujElem.innerHTML = newFormHTML;
    document.getElementById('ujtermek').style.display = 'none';

    let ujTelefonForm = document.getElementById("uj-telefon");
    ujTelefonForm.onsubmit = function (event) {
        event.preventDefault();
        let nev = event.target.elements.nev.value;
        let ara = event.target.elements.ara.value;
        let raktaron = event.target.elements.raktaron.checked;

        let xhr = new XMLHttpRequest();
        //xhr.open('POST', 'http://localhost:3000/telefonok', true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.onload = function() {
            if (xhr.status === 201) {
                renderTelefonok();
                ujElem.innerHTML = '';
                document.getElementById('ujtermek').style.display = 'block';
            } else {
                console.error('Hiba történt az adatok létrehozása során:', xhr.status, xhr.statusText);
            }
        };

        xhr.send(JSON.stringify({
            nev: nev,
            ara: ara,
            raktaron: raktaron
        }));
    };
};

function torles(id) {
    console.log("Törlendő elem id:", id)
    let xhr = new XMLHttpRequest();
   // xhr.open('DELETE', 'http://localhost:3000/telefonok/' + id, true);

    xhr.onload = function() {
        if (xhr.status === 200 || xhr.status === 204) {
            renderCsokik();
            console.log(xhr.status);
        } else {
            console.error('Hiba történt a törlés során:', xhr.status, xhr.statusText);
        }
    };

    xhr.send();
}

function modositas(id) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:3000/telefonok/' + id, true);

    xhr.onload = function() {
        if (xhr.status === 200) {
            let telefon = JSON.parse(xhr.responseText);
            let modositasFormHTML = `
                <h4>Termék módosítása:</h4>
                <form id="modositas-telefon" class="p-5">
                    <label class="w-100">
                        <h5>Termék neve:</h5>
                        <input class="form-control" type="text" name="nev" value="${telefon.nev}">
                    </label>
                    <label class="w-100">
                        <h5>Termék ára:</h5>
                        <input class="form-control" type="number" name="ara" value="${telefon.ara}">
                    </label>
                    <label>
                        <h5>Van raktáron?</h5> 
                        <input type="checkbox" name="raktaron" ${telefon.raktaron ? 'checked' : ''}>
                    </label>
                    <br>
                    <button class="btn btn-primary" type="submit">Mentés</button>
                </form>
            `;

            let szerkesztesElem = document.getElementById('szerkesztes');
            szerkesztesElem.innerHTML = modositasFormHTML;
            document.getElementById('ujtermek').style.display = 'none';

            let modositasTelefonForm = document.getElementById("modositas-telefon");
            modositasTelefonForm.onsubmit = function (event) {
                event.preventDefault();
                let nev = event.target.elements.nev.value;
                let ara = event.target.elements.ara.value;
                let raktaron = event.target.elements.raktaron.checked;

                let xhr = new XMLHttpRequest();
                //xhr.open('PUT', 'http://localhost:3000/telefon/' + id, true);
                xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

                xhr.onload = function() {
                    if (xhr.status === 200) {
                        renderTelefonok();
                        szerkesztesElem.innerHTML = '';
                        document.getElementById('ujtermek').style.display = 'block';
                    } else {
                        console.error('Hiba történt az adatok módosítása során:', xhr.status, xhr.statusText);
                    }
                };

                xhr.send(JSON.stringify({
                    nev: nev,
                    ara: ara,
                    raktaron: raktaron
                }));
            }
        } else {
            console.error('Hiba történt a módosítás során:', xhr.status, xhr.statusText);
        }
    };

    xhr.send();
}

window.onload = renderTelefonok;