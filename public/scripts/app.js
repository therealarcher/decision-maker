
let choiceOrder = []

$(document).ready(function() {
    
    $('tbody > tr > #draggable').draggable()
    
    $("#droppable" ).droppable({
        drop: function(event,ui) {
            var droppable = $(this);
            var draggable = ui.draggable;
            
            
            $(console.log(ui.draggable[0].innerHTML))
            choiceOrder.push(ui.draggable[0].innerHTML)
            console.log($(choiceOrder))
            
             $('#droppable').empty()
             $(draggable).draggable({
                 revert: true
                 
            })
            $(draggable).hide()
                 
             
              
           for(choice of choiceOrder) {
               $choice = `<li id="${choice}">${choice}</li>`
               if(choiceOrder.filter(word => word === choice)[0].toString()!== $(this)){
                $('#droppable').append($choice)
               } 
               $(console.log(ui.draggable[0].innerHTML))
               $(console.log($($choice).attr("id")))
                
           }
        
           $("#reset").click(function(e){
            $(console.log(e))
            $.each($(draggable), function(){ 
                if($(this).is(":hidden")) {
                    $(this).show();
                }
                
                
             
            });
            $(`#droppable`).empty()
            choiceOrder = [];
        })
        

                $(`li`).click( function(e) {
                    // if(choiceOrder.indexOf($($choice).attr("id")) !== ui.draggable[0].innerHTML) {
                     $(e.target).remove()   
                    // }
                    
                    $(choiceOrder.pop($(choiceOrder.indexOf($(this).attr( "id" )))))
                    
            })
        }
     })  
});

                     
            

