

'use strict'
$(document).ready(init); 

var letters = '';
var found = false;


function init(){

  console.log("here");
  //var drinks = getDrinks();
  //console.log("drinks: " , drinks);
  //renderDrinks(drinks);
  $('.newDrink').on('click', newDrink);
  $('.submitDrink').on('click', submitDrink);
  //console.log(tasks);
  /*$('.cancelAddTask').hide();
  $('.addNewTask').on('click', newTask);
  $('.submitTask').on('click', submitTask);
  $('.toDoList').on('click', '.Done',  taskCheck);
  $('.toDoList').on('click', '#delete', deleteTask);
  $('.toDoList').on('click', '#edit', editTask);
  $('.newTask').on('click', '.editTask', submitEdit);
  $('.cancelTask').on('click', cancelTask);
  $('.cancelAddTask').on('click', cancelTask);
  $('#deleteAll').on('click', deleteAllTasks);
  $('#deleteAllCompleted').on('click', deleteAllCompleted);
  $('.sortDescription').on('click', sortDescription);
  $('.reverseSortDescription').on('click', reverseSortDescription);
  $('.sortDate').on('click', sortDate);
  $('.reverseSortDate').on('click', reverseSortDate);
  $('.sortDone').on('click', sortDone);
  $('.reverseSortDone').on('click', reverseSortDone);
  $('.filter').keyup(filter);*/

}

function getDrinks(){
  var drinkStr = localStorage.drinks;
  try{
    var drinks = JSON.parse(drinkStr); 
  }
  catch(err){
    var drinks = [];
  }
  return drinks;
}

function renderDrinks(drinks){
 var $lis = drinks.map(drink => {
  var $li = $('.template').clone(); 
  var name = drink['name'];
  var percent =drink['percent'];
  var price = drink['price'];
  var worth = drink['worth'];
  $li.find('.name').text(name);
  $li.find('.percent').text(percent);
  $li.find('.price').text(price);
  $li.find('.worth').text(worth);
  $li.removeClass('template');
  return $li;
 });
  $('.drinkRatings').empty().append($lis);
}

function newDrink(){
  $('.newDrink').show();
  $('.cancelAddDrink').show();
  $('.submitDrink').show();
  $('.addNewDrink').hide();
  $(this).parent().find('.descriptionInput').val('');
  $(this).parent().find('.dueDateInput').val('');
  $('.dueDateInput').val(new Date().toDateInputValue());
}

function submitDrink(){
  //var page =1;
  var url =  `http://lcboapi.com/products?page=1&access_key=75dd6b9fe5d5abd2245bf6db4d23fa0a`
  $('.newDrink').hide();
  $('.addNewDrink').show();
  var name = $('.drinkNameInput').val();
  console.log(name);
  $('.drinkNameInput').val('');
  findDrink(name, url, 1);
  //console.log("drink: ",  drink);
  //var drink = {name, percentage, price, worth};
 // var drinks = getDrinks(); // read, parse
  //drinks.push(drink);
  //writeDrinks(drinks);
  //var ntasks = getTasks();
  //renderDrinks(drinks);
}



function findDrink(name, url, page){
  //event.preventDefualt();
  //var page = 1;
  //console.log("name: ", name, " page: ", page );
  $.ajax({
    url: url,
    method: 'GET', //defualt  is get, dont really need this
    dataType: 'jsonp',
    success: function(data){
       //console.log('data:', data.result[0].name);
       for(var i =0; i< data.pager.current_page_record_count; i++){

           console.log("api name: ", data.result[i].name.toLowerCase());
           console.log("entered name: ", name.toLowerCase());
          if(data.result[i].name.toLowerCase() === name.toLowerCase() ){
            found = true;
            console.log("found");
            var price = data.result[i].price_in_cents;
            var percent = data.result[i].alcohol_content;
            //console.log( "vol:", data.result[i].volume_in_milliliters);
            var volume = data.result[i].volume_in_milliliters;
            var worth = (volume*percent)/price;
            //console.log("price: ", price, " % ", percent);
            var drink = {name, percent, price, worth};
            console.log("in findDrink: " , drink);
            var drinks = getDrinks(); // read, parse
            drinks.push(drink);
            writeDrinks(drinks);
            renderDrinks(drinks);
          }
        }
        if(found === false){
          page++;
          var url =  `http://lcboapi.com/products?page=${page}&access_key=75dd6b9fe5d5abd2245bf6db4d23fa0a`;
          findDrink(name, url, page);
        }
      },
    error: function(error){
      console.log("Error: " , error);
    }
  });
}

//write to storage
function writeDrinks(drinks){
  var drinkStr = JSON.stringify(drinks);
  localStorage.drinks = drinkStr;
}




//set data to true
function taskCheck(){
  console.log("Check box clicked");
  var tasks = getTasks();
  var index = ($(this).parent().parent().parent().parent().index());
  var task = tasks[index];
  task['done'] = ($(this).prop( "checked" ));
  writeTasks(tasks);
  var newTasks = getTasks()
  renderTasks(newTasks);
  console.log("checked index: " ,index, " set at ", $('.toDoList'));
  //$('.toDoList').data('deleteIndex', index);
}

function deleteTask(){
  //console.log('click!');
  //cancelEdit();
  cancelTask();
  var tasks = getTasks();
  var index = $(this).parent().parent().parent().parent().index();
  tasks.splice(index, 1);
  //console.log(tasks);
  writeTasks(tasks);
  renderTasks(tasks);
}

function editTask(){
  $('.newTask').show();
  $('.editTask').show();
  $('.submitTask').hide();
  $('.cancelTask').show();
  $('.cancelAddTask').hide();
  $('.addNewTask').hide();
  //console.log($(this))//.parent().parent().parent().parent())
  var description = $(this).parent().parent().parent().parent().find(".Description").text();
  var date = $(this).parent().parent().parent().parent().find(".Date").text();
  //console.log(description);
  $('.descriptionInput').val(description);
  $('.dueDateInput').val(date);
  var index = $(this).parent().parent().parent().parent().index();
  //console.log("ind: " , index);
  $('.newTask').data('editIndex', index);
}

function submitEdit(){
  var description = $(this).parent().find('.descriptionInput').val();
  var date = $(this).parent().find('.dueDateInput').val();
  var index =  $('.newTask').data('editIndex');
  var tasks = getTasks();
  var task =tasks[index];
  task['description'] = description;
  task['date'] = date;
  writeTasks(tasks);
  renderTasks(tasks);
  cancelTask();
}

function cancelTask(){
  $('.newTask').hide();
  $('.cancelAddTask').hide();
  $('.addNewTask').show();
}

function deleteAllTasks(){
  var tasks = getTasks();
  var size = tasks.length;
  tasks.splice(0,size);
  writeTasks(tasks);
  renderTasks(tasks);
  cancelTask();
}

function deleteAllCompleted(){
  var tasks = getTasks();
  var indexs = [];
  console.log("delete index:" , $('.Done').data('deleteIndex'));
  for(var i =0; i< tasks.length; i++){
    var task = tasks[i];
    if(task['done'] === true){
      indexs.push(i);
    }
  }
   var newTasks = removeChecked(indexs, tasks)
   writeTasks(newTasks);
   renderTasks(newTasks);
}

function removeChecked(indexs, tasks){
  var arr = $.grep(tasks, function(n, i) {
      return $.inArray(i, indexs) ==-1;
  });

  return arr;
}

function sortDescription(){
  console.log("sort description");
  var tasks = getTasks();

 tasks.sort(function(a, b){
   var descA=a.description.toLowerCase(), descB=b.description.toLowerCase()
     if (descA < descB) //sort string ascending
       return -1 
     if (descA > descB)
       return 1
     return 0 //default return value (no sorting)
  })
  //console.log("sorted: " , tasks);  
  writeTasks(tasks);
  renderTasks(tasks);
}

function reverseSortDescription(){
  console.log("reverse sort description");
    console.log("sort description");
    var tasks = getTasks();

 tasks.sort(function(a, b){
   var descA=a.description.toLowerCase(), descB=b.description.toLowerCase()
     if (descA > descB) //sort string ascending
       return -1 
     if (descA < descB)
       return 1
     return 0 //default return value (no sorting)
  })
  //console.log("sorted: " , tasks);  
  writeTasks(tasks);
  renderTasks(tasks);

}

function sortDate(){
  console.log("sort date");
  var tasks = getTasks();
  tasks.sort(function(a, b){
   var dateA=new Date(a.date), dateB=new Date(b.date)
   return dateA-dateB //sort by date ascending
  })
  writeTasks(tasks);
  renderTasks(tasks);
}

function reverseSortDate(){
  console.log("reverse sort date");
   console.log("sort date");
  var tasks = getTasks();
  tasks.sort(function(a, b){
   var dateA=new Date(a.date), dateB=new Date(b.date)
   return dateB-dateA //sort by date ascending
  })
  writeTasks(tasks);
  renderTasks(tasks);

}

function sortDone(){
  console.log("sort done");
   var tasks = getTasks();
   tasks.sort(function(a, b){
   return a.done-b.done
   })
   writeTasks(tasks);
  renderTasks(tasks);
}

function reverseSortDone(){
  console.log("reverse sort done");
  //console.log("sort done");
   var tasks = getTasks();
   tasks.sort(function(a, b){
   return b.done-a.done
   })
   writeTasks(tasks);
   renderTasks(tasks);
}


Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

//65 =a ,z=90
function filter(event){
  var num = event.which;
  var c = String.fromCharCode(event.which);
  var tasks = getTasks();
  var nTasks = [];
  if(num === 8){
    letters = letters.substring(0, letters.length-1);
  }  
  else
    letters += c;

  for(let i =0; i < tasks.length; i++){
    var description = tasks[i].description
    description = description.toLowerCase();
    letters = letters.toLowerCase();
    if(letters === description.substring(0, letters.length)){
       nTasks.push(tasks[i]);
    }
  }
   renderTasks(nTasks);
}





