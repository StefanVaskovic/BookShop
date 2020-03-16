$(document).ready(function () {
  //idi gore
  $("#idiGore").hide();
  $(document).scroll(function () {
    var vrednost = $(this).scrollTop();
    if (vrednost > 1500) {
      $("#idiGore").slideDown();
    } else {
      $("#idiGore").slideUp();
    }
  });
  $('#idiGore a').click(function () {
    $.scrollTo(0, 'slow');
    return false;
  });
  //idi gde si kliknuo na link
  $("#mainNav a:not(.ostaje),header a,a[href='#knjige']").click(function (e) {
    e.preventDefault();
    var el = $(this).attr('href');
    var position = $(el).offset().top;
    $(window).animate({ scrollTop: position }, 1000);
  });
  //hover strelice
  $("#idiGore a").hover(function () {
    $(this).animate({ backgroundColor: "#fff" }, 200);
    $("#idiGore a i").animate({ color: "#333e4f" }, 200);
  }, function () {
    $(this).animate({ backgroundColor: "#333e4f" }, 200);
    $("#idiGore a i").animate({ color: "#fff" }, 200);
  });
  //meni toggle
  $("#menu").click(function () {
    $("#navbarResponsive").slideToggle('fast');
  });
});

/*-----------FILTER I SORT--------------- */

document.getElementById("tbSearch").addEventListener("keyup", filtrirajNaOsnovuUnosa);
document.getElementById("apply").addEventListener("click", sortIfilter);

function sortIfilter() {
  var cenaOd = $("#priceRange option:selected").data('from')
  var cenaDo = $("#priceRange option:selected").data('to')
  var ddlCena = $("#priceRange").val();

  let svi = document.getElementsByClassName("cbGenre");
  let idCekiranih = [];
  for (let jedan of svi) {
    if (jedan.checked) {
      idCekiranih.push(parseInt(jedan.dataset.idzanr))

    }
  }

  let ddlSortBy = $("#ddlSortBy").val();

  ajaxKnjige((knjige) => {
    var filter = knjige.filter(k => {
      let zanrovi = k.zanr.map(k => k.idZanr);
      let bool = true;
      for (let zanr of idCekiranih) {
        if (!(zanrovi.indexOf(zanr) !== -1)) {
          bool = false;
          break;
        }
      }
      return bool;
    });
    filter = filter.filter(k => {
      let bool = true;
      if (!(k.cena.nova <= cenaDo && k.cena.nova >= cenaOd)) {
        bool = false;
      }
      if (ddlCena == 0) {
        bool = true;
      }
      return bool;
    });
    if (ddlSortBy == "LtH") { ceniRastuce(filter); }
    else if (ddlSortBy == "HtL") { ceniOpadajuce(filter); }
    else if (ddlSortBy == "AZ") { naslovuOdAdoZ(filter); }
    else if (ddlSortBy == "ZA") { naslovuOdZdoA(filter); }
    else if (ddlSortBy == "New") { datumuNajnoviji(filter); }
    else if (ddlSortBy == "Old") { datumuNajstariji(filter); }
    else if (ddlSortBy == "0") { ispisKnjiga(filter) }
    else { brojuKomentara(filter); }

    ispisKnjiga(filter);
    ispisModala(filter);
    korpaZaSve(filter)
  });
}

function ceniRastuce(knjige) {
  let sortirano = knjige.sort((a, b) => {
    let cena1 = a.cena.nova;
    let cena2 = b.cena.nova;

    return cena1 - cena2;
  });
  ispisKnjiga(sortirano);
  ispisModala(sortirano);
  korpaZaSve(sortirano);
}
function ceniOpadajuce(knjige) {
  let sortirano = knjige.sort((a, b) => {
    let cena1 = a.cena.nova;
    let cena2 = b.cena.nova;

    return cena2 - cena1;
  });
  ispisKnjiga(sortirano);
  ispisModala(sortirano);
  korpaZaSve(sortirano);
}
function naslovuOdAdoZ(knjige) {
  let sortirano = knjige.sort((a, b) => {
    let naslov1 = a.naslov;
    let naslov2 = b.naslov;

    return naslov1 > naslov2 ? 1 : -1;
  });
  ispisKnjiga(sortirano);
  ispisModala(sortirano);
  korpaZaSve(sortirano)
}
function naslovuOdZdoA(knjige) {
  let sortirano = knjige.sort((a, b) => {
    let naslov1 = a.naslov;
    let naslov2 = b.naslov;

    return naslov1 < naslov2 ? 1 : -1;
  });
  ispisKnjiga(sortirano);
  ispisModala(sortirano);
  korpaZaSve(sortirano)
}
function datumuNajnoviji(knjige) {
  let sortirano = knjige.sort((a, b) => {
    let datum1 = new Date(a.datum);
    let datum2 = new Date(b.datum);

    return Date.UTC(datum2.getFullYear(), datum2.getMonth(), datum2.getDate()) - Date.UTC(datum1.getFullYear(), datum1.getMonth(), datum1.getDate());
  });
  ispisKnjiga(sortirano);
  ispisModala(sortirano);
  korpaZaSve(sortirano)
}
function datumuNajstariji(knjige) {
  let sortirano = knjige.sort((a, b) => {
    let datum1 = new Date(a.datum);
    let datum2 = new Date(b.datum);

    return Date.UTC(datum1.getFullYear(), datum1.getMonth(), datum1.getDate()) - Date.UTC(datum2.getFullYear(), datum2.getMonth(), datum2.getDate());
  });
  ispisKnjiga(sortirano);
  ispisModala(sortirano);
  korpaZaSve(sortirano)
}
function brojuKomentara(knjige) {
  let sortirano = knjige.sort((a, b) => {
    let kom1 = a.komentari.length;
    let kom2 = b.komentari.length;

    return kom2 - kom1;
  });
  ispisKnjiga(sortirano);
  ispisModala(sortirano);
  korpaZaSve(sortirano)
}
function filtrirajNaOsnovuUnosa() {
  var unos = this.value.toLowerCase();
  ajaxKnjige((knjige) => {
    var knjige = knjige.filter(k => {
      let bool = k.naslov.toLowerCase().indexOf(unos) != -1 ? true : false;

      return bool;
    });
    ispisKnjiga(knjige);
    ispisModala(knjige);
    korpaZaSve(knjige);
  })
}
function ubaciKnjigeUlocalStorageKorpa(knjiga) {
  localStorage.setItem("knjigeKorpa", JSON.stringify(knjiga));
}
function dohvatiKnjigeIzlocalStorageKorpa() {
  return JSON.parse(localStorage.getItem("knjigeKorpa"));
}

/* ----------------------ISPISI I KORPA---------------------*/


ajaxKnjige((knjige) => {
  console.log(knjige);
  ispisKnjiga(knjige);
  ispisModala(knjige);

  korpaZaSve(knjige);
});
function korpaZaSve(knjige) {
  let korpeDugme = document.getElementsByClassName("korpa");
  for (let k of korpeDugme) {
    k.addEventListener("click", dodajUkorpu);
  }

  function dodajUkorpu() {
    var id = this.dataset.idknjige;

    var nizKnjige = [];

    var knjigeIzLs = dohvatiKnjigeIzlocalStorageKorpa();

    if (knjigeIzLs !== null) {
      if (knjigeIzLs.filter(p => p.id == id).length) {
        let knjigeIzLs = dohvatiKnjigeIzlocalStorageKorpa();
        for (let i in knjigeIzLs) {
          if (knjigeIzLs[i].id == id) {
            knjigeIzLs[i].kolicina++;
            break;
          }
        }
        ubaciKnjigeUlocalStorageKorpa(knjigeIzLs);
      } else {
        for (let k of knjigeIzLs) {
          nizKnjige.push(k);
        }
        let novaKnjiga = knjige.find(k => k.id == id);

        nizKnjige.push({
          id: novaKnjiga.id,
          kolicina: 1
        });
        ubaciKnjigeUlocalStorageKorpa(nizKnjige);
      }
    } else {
      let knjiga = knjige.find(k => {
        return k.id == id;
      });
      nizKnjige[0] = {
        id: knjiga.id,
        kolicina: 1
      };
      ubaciKnjigeUlocalStorageKorpa(nizKnjige)
    }
    alert("Successfuly added to cart!");

  }
}

(function ispisOpsegCena(){
  let niz = ["$100 to $199","$200 to $299","$300 to $399","$400 to $499","$500 to $599"];
  let ispis =``;
  let prom1 = 100;
  let prom2 = 199;
  let index = 1;
  for (let i in niz) {
    ispis+=`<option value="${index}" data-from="${prom1}" data-to="${prom2}">${niz[i]}</option>`;
    prom1 += 100;
    prom2 += 100;
    index++;
  }
  $("#priceRange").append(ispis);
})();
(function ispisZanrova(){
  $.ajax({
    url: "data/zanrovi.json",
    method: "GET",
    dataType: "json",
    success: function (zanrovi) {
        let ispis = ``;
        for (let z of zanrovi) {
          ispis += `<input type="checkbox" class="cbGenre" data-idzanr="${z.id}" value="${z.naziv}"/>${z.naziv}<br/>`;
        }
        $("#zanrovi").html(ispis);
      }
  });  
})();
(function ispisSortBy(){
  let niz = ["Price Low to High","Price High to Low","Title A-Z","Title Z-A","Newest","Oldest","Popularity"];
  let values = ["LtH","HtL","AZ","ZA","New","Old","P"];
  let ispis =``;
  for (let i in niz) {
    ispis+=`<option value="${values[i]}">${niz[i]}</option>`;
  }
  $("#ddlSortBy").append(ispis);
})();


function ajaxKnjige(callBack) {
  $.ajax({
    url: "data/knjige.json",
    method: "GET",
    dataType: "json",
    success: callBack
  });
}

function ispisModala(knjige) {
  let ispis = ``;
  let i = 1;
  for (let k of knjige) {
    ispis += `<div class="portfolio-modal modal fade" id="portfolioModal${i}" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="close-modal" data-dismiss="modal">
                  <div class="lr">
                    <div class="rl"></div>
                  </div>
                </div>
                <div class="container">
                  <div class="row">
                    <div class="col-lg-8 mx-auto">
                      <div class="modal-body">
                        <!-- Project Details Go Here -->
                        <h2 class="text-uppercase">Short summary</h2>
                        <img class="img-fluid d-block mx-auto" src="${k.slika.src}" alt="${k.slika.alt}">
                        <p>${k.tekst}</p>
                        <ul class="list-inline">
                          <li>Publish date: ${k.datum}</li>
                          <li>Genres: ${obradaZanrova(k.zanr)}</li>
                        </ul>
                        <button class="btn btn-primary" data-dismiss="modal" type="button">
                          <i class="fas fa-times"></i>
                          Close</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
    i++;
  }
  $("#sviModali").html(ispis);
}

function ispisKnjiga(knjige) {
  let ispisKnjiga = ``;
  let ispisDDLknjige = ``;
  let i = 1;
  for (let k of knjige) {
    ispisKnjiga += `<div class="col-lg-4 col-md-6 col-sm-12 portfolio-item ">
            <a class="portfolio-link" data-toggle="modal" href="#portfolioModal${i}">
              <div class="portfolio-hover">
                <div class="portfolio-hover-content">
                  <i class="fas fa-plus fa-3x"></i>
                </div>
              </div>
              <img class="img-fluid" src="${k.slika.src}" alt="${k.slika.alt}">
            </a>
            <div class="portfolio-caption">
              <h4>${k.naslov}</h4>
              <div class="bodyKnjiga">
                <div class="autor">
                    <p>Author: <span class="text-muted">${k.autor.autor}</span></p>
                </div>
                <div class="kategoija">
                  <p>Genre: <span class="text-muted">${obradaZanrova(k.zanr)}</span></p>
                </div>
                <div class="datum">
                  <p>Publish date: <span class="text-muted">${k.datum}</span></p>
                </div>
                <div class="cena">
                  <p>Price: <span class="text-muted novaCena">$${k.cena.nova} </span><del class="staraCena">${obradaCene(k.cena.stara)}</del>
                  </p>
                </div>
                <div class="komentari">
                  <p>Comments: <a href="#comment" class="link-comment" data-idknjige="${k.id}">(${k.komentari.length})</a></p>
                </div>
              </div>
              <button class="korpa btn btn-outline-warning" data-idknjige="${k.id}">Add to cart</button>
            </div>
          </div>`;
          function obradaCene(cena){
            if(cena == undefined || cena == null){
              return ""
            }else{
              return "$"+cena;
            }
          }
    i++;
    ispisDDLknjige+=`<option value="${k.naslov}">${k.naslov}</option>`;
  }
  $("#knjige").html(ispisKnjiga);
  $("#ddlBooks").append(ispisDDLknjige);
  console.log(ispisDDLknjige);
  $(".link-comment").click(function (e) {
    e.preventDefault();
    var id = $(this).data('idknjige');

    var el = $(this).attr('href');
    var position = $(el).offset().top;
    $(window).animate({ scrollTop: position }, 1000);

    ajaxKnjige((knjige) => {
      console.log(knjige);
      ispisKomentara(knjige, id);
    });
  });
}

function ispisKomentara(knjige, idKnjige) {
  let ispis = ``;
  let i = 1;
  for (let k of knjige) {
    if (k.id == idKnjige) {
      for (let kom of k.komentari) {
        ispis += ` <div class="col-12">
                    <div class="team-member d-flex p-3 mb-2 text-dark rounded">
                      <div class="personInformation">
                        <img class="rounded-circle" src="${kom.korSlika}" alt="korisnik${i}">
                        <h6 class="personName">${kom.korisnickoIme}</h6>
                      </div>
                      <div class="comment">${kom.tekst}</div>
                      <div class="ikonicaKoment">
                        <i class="fas fa-quote-right fa-3x"></i> 
                        <i class="fas fa-quote-left hidden fa-3x"></i>  
                      </div>
                    </div>
                  </div>`;
      }
      i++;
      break;
    }
  }
  if (ispis == "") {
    $("#komentari").html("<div class='col-12 text-center'><h3>There is no comments for this topic!</h3></div>");

  } else {
    $("#komentari").html(ispis);
    $(".fa-quote-right").css({ position: "absolute", top: "10px", right: "25px" });
    $(".hidden").css({ visibility: "hidden" });

  }

}

function obradaZanrova(zanrovi) {
  let ispis = "";
  for (let zanr of zanrovi) {
    ispis == "" ? ispis += zanr.naziv : ispis += ', ' + zanr.naziv;
  }
  return ispis;
}
/* ------------------------VALIDACIJA FORME------------------------*/
document.getElementById("sendMessageButton").addEventListener("click", provera);
document.getElementById("phone").addEventListener("keyup", dodajKosuCrtu);


function provera(e) {
  //prevent default zbog njihovog js-a
  e.preventDefault();
  let validno = true;

  let ime = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim();
  let telefon = document.getElementById("phone").value.trim();
  let ddlBooks = document.getElementById("ddlBooks").value;

  let reIme = /^([A-ZČĆŽŠĐŠЧЋШЂЉЊЖ][a-zčćđšžчћшђљњж]+)\s?([A-ZČĆŽŠĐŠЧЋШЂЉЊЖ][a-zčćđšžчћшђљњж]+)?$/;
  let reEmail = /^[\w][\w\_\-\.\d]+\@[\w]+(\.[\w]+)?(\.[a-z]{2,3})$/;
  let reTelefon = /^06[0123459]\/([\d][\d][\d])\/([\d][\d][\d][\d]?)$/;

  if (ime == "") {
    document.getElementById("greskaIme").innerHTML = "Field must not be blank..";
    validno = false;
  } else if (!reIme.test(ime)) {
    document.getElementById("greskaIme").innerHTML = "First uppercase letter is missing or more than one word is entered";
    validno = false;
  }
  else {
    document.getElementById("greskaIme").innerHTML = "";
  }

  if (email == "") {
    document.getElementById("greskaEmail").innerHTML = "Field must not be blank..";
    validno = false;
  } else if (!reEmail.test(email)) {
    document.getElementById("greskaEmail").innerHTML = "Email is not in good format.";
    validno = false;
  }
  else {
    document.getElementById("greskaEmail").innerHTML = "";
  }


  if (telefon == "") {
    document.getElementById("greskaTelefon").innerHTML = "Field must not be blank..";
    validno = false;
  } else if (!reTelefon.test(telefon)) {
    document.getElementById("greskaTelefon").innerHTML = "Phone is not in good format.";
    validno = false;
  }
  else {
    document.getElementById("greskaTelefon").innerHTML = "";
  }


  if (ddlBooks == "0") {
    document.getElementById("greskaBusiness").innerHTML = "You need to choose an option.";
    validno = false;
  } else {
    document.getElementById("greskaBusiness").innerHTML = "";
  }

  let rbPol = document.getElementsByName("rbPol");
  var vrednost = "";
  for (let pol of rbPol) {
    if (pol.checked) {
      vrednost = pol.value;
      break;
    }
  }

  if (vrednost == "") {
    document.getElementById("greskaPol").innerHTML = "You need to choose gender.";
    validno = false;
  } else {
    document.getElementById("greskaPol").innerHTML = "";
  }

  let poruka = document.getElementById("message").value.trim();
  if (poruka == "") {
    document.getElementById("greskaPoruka").innerHTML = "You need to fill in this field.";
    validno = false;
  } else {
    document.getElementById("greskaPoruka").innerHTML = "";
  }

  let uslov = document.getElementById("cbUslov");
  if (!uslov.checked) {
    document.getElementById("greskaUslovi").innerHTML = "You need to check this field.";
    validno = false;
  } else {
    document.getElementById("greskaUslovi").innerHTML = "";
  }

  if (validno) {
    alert("Poruka je poslata!");
    location.reload();
  }
}
function dodajKosuCrtu() {
  let vrednostTelefon = document.getElementById("phone").value.trim();
  if (vrednostTelefon.length == 3 || vrednostTelefon.length == 7) {
    vrednostTelefon += "/";
  }
  document.getElementById("phone").value = vrednostTelefon;
}



