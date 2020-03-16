function ajaxKnjige(callBack) {
    $.ajax({
        url: "data/knjige.json",
        method: "GET",
        dataType: "json",
        success: callBack
    });
}

var nizKnjige = []
var knjigeIzLs = dohvatiKnjigeIzlocalStorageKorpa();
console.log(knjigeIzLs.length)
if (knjigeIzLs.length) {
    ispisKnjigaKrozTabelu();
} else {
    $("#drziTabelu").html("<h1>Cart is empty!</h1>");
    
}
console.log(knjigeIzLs.length);
console.log(nizKnjige);



function ispisKnjigaKrozTabelu() {
    ajaxKnjige(function (knjige) {
        knjige = knjige.filter(k => {
            for (let knjiga of knjigeIzLs) {
                if (k.id == knjiga.id) {
                    k.kolicina = knjiga.kolicina;
                    return true;
                }

            }
            return false;
        });
        tabela(knjige);
    });


    function tabela(knjige) {
        let ispis = `
<thead>
    <th>Picutre</th>
    <th>Title</th>
    <th>Quantity</th>
    <th>Price</th>
    <th>Remove</th>
</thead>
<tbody>`;
        for (let k of knjige) {
            ispis += `
        <tr>
            <td><img src="${k.slika.srcKorpa}"/></td>
            <td>${k.naslov}</td>
            <td><input type="number" data-id="${k.id}" class="nmbKolicina" value="${k.kolicina}" min="1"/></td>
            <td>$${k.cena.nova * k.kolicina}</td>
            <td><button id="izbrisi" class="btn btn-light" onclick="izbirsiIzKorpe(${k.id})" data-idknjige="${k.id}">Remove</button></td>
        </tr>
    `;
        }
        ispis += `</tbody>
`;
        $("#tabela").html(ispis);
        $(".nmbKolicina").change(function(){
            var vred = Number($(this).val());
            var id = $(this).data('id');

            
            for (let k of knjigeIzLs) {
                if(k.id==id){
                    k.kolicina = vred;
                }
            }

            ispisKnjigaKrozTabelu();
        });
        
    }
}
function izbirsiIzKorpe(id){
    let knjigeBezKliknute = knjigeIzLs.filter(k => k.id != id);

    ubaciKnjigeUlocalStorageKorpa(knjigeBezKliknute);

    ispisKnjigaKrozTabelu();

    location.reload();
  
}


function ubaciKnjigeUlocalStorageKorpa(knjiga) {
    localStorage.setItem("knjigeKorpa", JSON.stringify(knjiga));
}
function dohvatiKnjigeIzlocalStorageKorpa() {
    return JSON.parse(localStorage.getItem("knjigeKorpa"));
}

