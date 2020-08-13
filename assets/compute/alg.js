import {find_minimums, get_minimum, number_minimums, minimum_score, set_weights} from "./rshape.js"

var input_regex = /^\s*([AUGC]+)\s*$/mg;

function read_number(element, fallback, scale){
  let val = element.value;
  if(!val) return fallback;
  //TODO: add negative number check
  return Math.floor(val*scale);
}



document.getElementById("calc_result").onclick = function(){
  //use 10x scale, all input values expected positive in app input
  let gap_penalty = read_number(document.getElementById("gap_penalty"),1,10);
  let min_gap = read_number(document.getElementById("min_gap"),3,1);
  let au_score = read_number(document.getElementById("weight_au"),20,10);
  let gu_score = read_number(document.getElementById("weight_gu"),20,10);
  let gc_score = read_number(document.getElementById("weight_gc"),30,10);
  
  let input_string = document.getElementById("input_seq").value
  let match = input_regex.exec(input_string);
  if(!match || match[1].length == 0){
    //TODO: highlight error on box
    return;
  }
  let sequence = match[1];
  
  set_weights(gap_penalty, min_gap, au_score, gu_score, gc_score);
  find_minimums(sequence);
  document.getElementById("result_seq").value = get_minimum(0);
  document.getElementById("result_score").value = minimum_score()/10;
};

