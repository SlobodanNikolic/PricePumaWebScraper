var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

var START_URL = "https://play.google.com/store/apps/category/GAME";
var MAX_PAGES_TO_VISIT = 100000;

var pagesVisited = {};
var numPagesVisited = 0;
var pagesToVisit = [];
var url = new URL(START_URL);
var baseUrl = url.protocol + "//" + url.hostname;

pagesToVisit.push(START_URL);
crawl();

function crawl() {
  if(numPagesVisited >= MAX_PAGES_TO_VISIT) {
    console.log("Reached max limit of number of pages to visit.");
    return;
  }
  var nextPage = pagesToVisit.pop();
  if (nextPage in pagesVisited) {
    // We've already visited this page, so repeat the crawl
    crawl();
  } else {
    // New page we haven't visited
    visitPage(nextPage, crawl);
  }
}

function visitPage(url, callback) {
  // Add page to our set
  pagesVisited[url] = true;
  numPagesVisited++;

  // Make the request
  if(url == undefined)
  	return;

  // console.log("Visiting page " + url);
  request(url, function(error, response, body) {
     // Check status code (200 is HTTP OK)
     // console.log("Status code: " + response.statusCode);
     if(response.statusCode !== 200) {
       callback();
       return;
     }
     // Parse the document body
     var $ = cheerio.load(body);

     //PRETRAGA IDE OVDE:
     search($);

     // var isWordFound = searchForWord($, SEARCH_WORD);
     // if(isWordFound) {
     //   console.log('Word ' + SEARCH_WORD + ' found at page ' + url);
     // } else {
     collectInternalLinks($);
       // In this short program, our callback is just calling crawl()
     callback();
     //}
  });
}

function searchForWord($, word) {
	console.log($("img._img").text());
}


function search($){
	// console.log("Searching page...");
	// var item = $("a.item");

	// var image = item.find("div._product-grid-xmedia").find("img").attr("src");
	// if(image != undefined) {
	// 	console.log(image);
	// 	console.log("**************************");
	// }
	// var product = $("li.product");
	// var name = product.find("div.product-info").find("div.product-info-item-name").text();
	// if(name != undefined && name != ""){
	// 	console.log(name);
	// 	console.log("**************************");
	// }

	// var title = $("div.col-sm-8").find("h1").text();
	// console.log(title);
	// console.log("**************************");

	var image = $("input.product-image-active").attr("value");

	if(image!=undefined){
		// var infoWrapper = $("div.product-info-wrapper");
		console.log(image);
		var itemTitle = $("div.product-intro").find("h1").text();
		console.log(itemTitle);
		var price = $("span.product-price-value").text();
		console.log(price);

	}
	//var test = $("article.content").find("header").find("h1").text();
	// var title = article.find("header").find("h1").text();

	// console.log(title);
	// //tip hrane/tagovi
	// //ovo je sve jedan string, nadovezuje ih jedan na drugi, treba splitovati po velikom slovu
	// console.log(article.find("header").find("ul.category").find("li").find("a").text());
	// //slika
	// console.log(article.find("header").find("figure").find("img").attr("src"));
	// //tezina
	// //console.log(article.find("header").find("ul.info-recipe").find("div.difficulty easy"));
	// //rejting
	// console.log(article.find("header").find("div.rating-stars-single").attr("data-rating"));
	
	// var k;
	// var v;
	// var ingredDict = []; // create an empty array

	// //sastojci
	// var ingredTable = article.find("table.ingredients").find("tbody");
	// ingredTable.find("tr").each(function(index, value){
	// 	$('td', this).each(function(index, value){
	// 		var text = $(this).text();
	// 		if(index == 0){
	// 			k = text;
	// 		}
	// 		else{
	// 			v = text;
	// 			ingredDict.push({
	// 			    key:   k,
	// 			    value: v
	// 			});
	// 		}
	// 	});
 //        // self.thejson[k] = v;
 //    });

	// //Uputstvo za pripremu
	// //U slucaju da postoji slika uz korak, <li> ce imati klasu "has-image"
	// //console.log(article.find("div.instructions").find("ul").find("li").find("p").text());

	// var instructions = [];
	// article.find("div.instructions").find("ul").find("li").each(function(index, value){
	// 	var text = $(this).find("p").text();
	// 	var image = $(this).find("img").attr("src");
	// 	if(image != undefined && image != null){
	// 		//ima sliku

	// 	}
	// 	else{
	// 		//nema sliku
	// 	}
	// });

	// console.log("**************************");

}

function collectInternalLinks($) {
    
  var allRelativeLinks = [];
  var allAbsoluteLinks = [];

  var relativeLinks = $("a[href^='/']");
  relativeLinks.each(function() {
  	allRelativeLinks.push(baseUrl + $(this).attr('href'));
	pagesToVisit.push(baseUrl + $(this).attr('href'));
  });

  var absoluteLinks = $("a[href^='http']");
  absoluteLinks.each(function() {
  	if($(this).attr('href').includes("www.tike.rs")){
      allAbsoluteLinks.push($(this).attr('href'));
      pagesToVisit.push($(this).attr('href'));
  	}
  });

  // console.log("Found " + allRelativeLinks.length + " relative links");
  // console.log("Found " + allAbsoluteLinks.length + " absolute links");

    
}

function collectRelativeLinks($) {
    
  var allRelativeLinks = [];

  var relativeLinks = $("a[href^='/']");
  relativeLinks.each(function() {
  	allRelativeLinks.push(baseUrl + $(this).attr('href'));
	pagesToVisit.push(baseUrl + $(this).attr('href'));
  });


  console.log("Found " + allRelativeLinks.length + " relative links");

    
}

