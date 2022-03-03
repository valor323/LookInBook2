$(document).ready(initializeApp);


//global variables
var outside;

function initializeApp(){
    newYorkTimesAjax();
    // clickHandlerToOpenNewPage();
}

// function clickHandlerToOpenNewPage() {
//     $('.poster').on('click', openBookPage)
// }

async function newYorkTimesAjax (){
    var newYorkTimesParams = {
      url: "https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json",
      method: 'GET',
      data: {
        'api-key': "2MvAdED6gUAZDABMQsGSABBRqNDXa1T2"
      },
      success: newYorkTimesAjaxSuccessful,
      error: newYorkTimesAjaxError,
    }
    await $.ajax( newYorkTimesParams );
}

function newYorkTimesAjaxSuccessful(responseData){
    console.log('success');
    // for(i=0; i<responseData.results.length; i++){
    //     $('#bookRow').append('<div id="' + responseData.results[i].ranks_history.rank + '">').append(responseData.results[i].title);
    // }
    console.log(responseData);
    retrieveBookInfo(responseData);

}

function newYorkTimesAjaxError(){
    console.log('error');
}

async function retrieveBookInfo(responseData){
    for(i=0; i < responseData.results.length; i++){
        if(typeof responseData.results[i].isbns[0]=== 'object'){
            let googleBooksCall = {
                url: 'https://www.googleapis.com/books/v1/volumes?',
                method: 'GET',
                data: {
                    'api-key': 'AIzaSyAi_F1l9eRkXcRtV1NBCJAnFqwXV-ZtTu0',
                    'q': responseData.results[i].isbns[0].isbn13,
                    'maxResults': 1,
                    'orderBy': 'relevance',
                    'showPreorders': false,
                },
                success: googleBooksAjaxSuccessful,
                error: googleBooksAjaxError,
            }
            await $.ajax(googleBooksCall);  
        }
             
    }
}

function googleBooksAjaxSuccessful(responseData){
    console.log('success');
    console.log(responseData);
    let image = responseData.items[0].volumeInfo.imageLinks.thumbnail;
    // let imageSource = image.addClass('poster')
    // $('#bookRow').append("<img src ='" + imageSource + "'>")
    let bookPoster = $('<img>').addClass('poster').attr({'src' : image, 'title': responseData.items[0].volumeInfo.title, 'description': responseData.items[0].volumeInfo.description}).on('click', openBookPage);
    $('#bookRow').append(bookPoster)
}

function googleBooksAjaxError(){
    console.log('error');
}

function openBookPage() {
    console.log('this', $(this))
    $('.poster').remove();
    
}
