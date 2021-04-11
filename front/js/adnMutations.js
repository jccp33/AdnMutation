
// ajax object to get data from any server
function ObjectAjax(){
	var xmlhttp=false;
	try{
		xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
	}catch (e){
		try{
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}catch (E){
			xmlhttp = false;
		}
	}
	if(!xmlhttp && typeof XMLHttpRequest!='undefined'){
		xmlhttp = new XMLHttpRequest();
	}
	return xmlhttp;
}

// generate a new random DNA sequence
function getNewADN(){
	let values = "ACGT";
	let adn = "";
	for(let i=0; i<36; i++){
		let ind = Math.floor(Math.random() * 4);
		adn += values[ind];
	}
	return adn;
}

// validate string as JSON object
function IsJsonString(str){
    try{
        JSON.parse(str);
    }catch (e){
        return false;
    }
    return true;
}

// validates if a DNA contains mutations from the backend
function CheckADN(adn){
    let ajax = ObjectAjax();
	ajax.open("POST", "http://localhost:8000/mutation");
	ajax.onreadystatechange=function(){
        let response = {};
		if (ajax.readyState === 4){
			if(IsJsonString(ajax.responseText)){
				response = JSON.parse(ajax.responseText);
                let row_new_adn = document.getElementById('row_new_adn');
                let date = response.date.split("-");
                date = date[2] + "/" + date[1] + "/" + date[0];
                
                let inner = "<div class='row text-center'><div class='col-3'><p>DATE</p></div><div class='col-6'><p>ADN</p></div><div class='col-3'><p>RESULT</p></div></div>";
                inner += "<div class='row text-center'>"
                inner += "<div class='col-3'>" + date + "</div>";
                inner += "<div class='col-6'>" + response.ADN + "</div>";
                inner += "<div class='col-3'>" + response.response + "</div>";
                inner += "</div>"
                row_new_adn.innerHTML = inner;
                GetStats();
                GetList();
			}else{
				response = {response:403, text:"Forbidden", message:"Invalid Response", ADN:""};
                let row_new_adn = document.getElementById('row_new_adn');
                    row_new_adn.innerHTML = "";
			}
		}
	}
	ajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	ajax.send("adn=" + adn);
}

// get the last ten queries to the backend
function GetList(){
	let ajax = ObjectAjax();
	ajax.open("POST", "http://localhost:8000/list");
	ajax.onreadystatechange=function(){
		if (ajax.readyState === 4){
			let response = {};
			if(IsJsonString(ajax.responseText)){
				response = JSON.parse(ajax.responseText);
			}else{
				response = {response:403, text:"Forbidden", message:"Invalid Response", data:[]};
			}
            if(response.response === 200){
                let array = response.data;
                let table_tbody = document.getElementById('table_tbody');
                let inner = "";
                for(let i=0; i<array.length; i++){
                    let date = array[i].date.split("-");
                    date = date[2] + "/" + date[1] + "/" + date[0];
                    inner += "<tr>";
                    inner += "<td>" + date + "</td>";
                    inner += "<td>" + array[i].ADN + "</td>";
                    inner += "<td>" + array[i].response + "</td>";
                    inner += "</tr>";
                }
                table_tbody.innerHTML = inner;
            }else{
                let table_tbody = document.getElementById('table_tbody');
                table_tbody.innerHTML = "";
            }
		}
	}
	ajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	ajax.send();
}

// get statistics from the backend
function GetStats(){
	let ajax = ObjectAjax();
	ajax.open("POST", "http://localhost:8000/stats");
	ajax.onreadystatechange=function(){
		if (ajax.readyState === 4){
			let response = {};
			if(IsJsonString(ajax.responseText)){
				response = JSON.parse(ajax.responseText);
			}else{
				response = {response:403, text:"Forbidden", message:"Invalid Response", data:[]};
			}
            // console.log(response.data);
            if(response.response === 200){
                let header = document.getElementById('header');
                let inner = "<div class='col-4 text-center'>" + response.data.count_mutations + "</div>";
                inner += "<div class='col-4 text-center'>" + response.data.count_no_mutations + "</div>";
                inner += "<div class='col-4 text-center'>" + response.data.ratio + "</div>";
                header.innerHTML = inner;
            }
		}
	}
	ajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	ajax.send();
}

// validate a new DNA sequence from a string
function CheckNewADN(){
    let input_adn = document.getElementById('input_adn');
    if(input_adn.value.length === 36){
        CheckADN(input_adn.value);
    }else{
        input_adn.value = "INVALID ADN!!!";
        input_adn.focus();
    }
}

// obtain the first data when entering the web page
GetStats();
GetList();
