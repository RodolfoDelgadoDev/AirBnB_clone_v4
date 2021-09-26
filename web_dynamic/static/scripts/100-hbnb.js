$( document ).ready(function() {
	let list_amenities = {};
	let list_states = {};
	let list_cities = {};
	let url_api = 'http://0.0.0.0:5001/api/v1';

	$('.amenities .popover ul li input').click(function(e) {
		if (list_amenities[e.target.dataset.id] === undefined)
		{
			list_amenities[e.target.dataset.id] = e.target.dataset.name;
		}
		else
		{
			delete list_amenities[e.target.dataset.id];
		}

		let text = "";
		for (let elem in list_amenities) {
			text += list_amenities[elem] + ", ";
		}
		
		if (text === "")
			$('.amenities h4').html("&nbsp;");
		else
			$('.amenities h4').text(text.substring(0, text.length-2));
	});


	$('.locations .popover ul li h2 input').click(function(e) {
		if (list_states[e.target.dataset.id] === undefined)
		{
			list_states[e.target.dataset.id] = e.target.dataset.name;
		}
		else
		{
			delete list_states[e.target.dataset.id];
		}

		printSC();
	});

	$('.locations .popover ul li ul li input').click(function(e) {
		if (list_cities[e.target.dataset.id] === undefined)
		{
			list_cities[e.target.dataset.id] = e.target.dataset.name;
		}
		else
		{
			delete list_cities[e.target.dataset.id];
		}

		printSC();
	});

	function printSC()
	{
		let text = "";
		for (let elem in list_states) {
			text += list_states[elem] + ", ";
		}

		let text2 = "";
		for (let elem2 in list_cities) {
			text2 += list_cities[elem2] + ", ";
		}

		text = text.substring(0, text.length-2)
		text2 = text2.substring(0, text2.length-2);

		if (text2 !== "")
		{
			if (text !== "")
				text += ", ";
			text += text2;
		}

		$('.locations h4').html(text);
	}



	$.get(url_api+"/status/", function (data) {
		$("#api_status").addClass("available");
	});

	$('.filters button').click(function(e) {
		load(true);
	});

	load(false);
	async function load(isFiltersAplicated)
	{
		let dataSend = "{}";

		if (isFiltersAplicated)
		{
			let amenitiesList = [];
			let statesList = [];
			let citiesList = [];

			for (let i in list_amenities)
			{
				amenitiesList.push(i);
			}

			for (let i in list_states)
			{
				statesList.push(i);
			}

			for (let i in list_cities)
			{
				citiesList.push(i);
			}

			dataSend = JSON.stringify({
				states: statesList,
				cities: citiesList,
				amenities: amenitiesList
			});
		}

		let data = await ajaxConn(url_api+"/places_search/", "POST", dataSend);;
		
		let html = "";

		for (let i in data)
		{
			let user = await ajaxConn(url_api+"/users/"+data[i].user_id, "GET");

			let notS = '';
			let notS2 = '';
			let notS3 = '';

			if (data[i].max_guest != 1)
				notS = 's';

			if (data[i].number_rooms != 1)
				notS2 = 's';

			if (data[i].number_bathrooms != 1)
				notS3 = 's';

			let prefab = `
						<article>
							<div class="title_box">
								<h2>`+data[i].name+`</h2>
							<div class="price_by_night">$`+data[i].price_by_night+`</div>
						</div>
						<div class="information">
							<div class="max_guest">`+data[i].max_guest+` Guest`+notS+`</div>
							<div class="number_rooms">`+data[i].number_rooms+` Bedroom`+notS2+`</div>
							<div class="number_bathrooms">`+data[i].number_bathrooms+` Bathroom`+notS3+`</div>
						</div>
						<div class="user">
							<b>Owner:</b> `+user.first_name+` `+user.last_name+`
						</div>
						<div class="description">
							`+data[i].description+`
						</div>
					</article>
			`;
			html += prefab;
		}

		$('.places').html(html);
	}


	function ajaxConn(url, type, data = "")
	{
		return ($.ajax({
			url: url,
			type: type,
			data: data,
			contentType:"application/json",
			dataType:"json"
		}));
	}
});
