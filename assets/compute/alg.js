import {find_minimums, get_minimum, number_minimums, minimum_score, set_weights} from "./rshape.js"

var input_regex = /^\s*([AUGC]+)\s*$/m;
var input_box = document.getElementById("input_seq");
var gap_penalty_box = document.getElementById("gap_penalty");
var min_gap_box = document.getElementById("min_gap");
var weight_au_box = document.getElementById("weight_au");
var weight_gu_box = document.getElementById("weight_gu");
var weight_gc_box = document.getElementById("weight_gc");
var result_score_box = document.getElementById("result_score");
var result_seq_box = document.getElementById("result_seq");

function read_number(element, fallback, scale){
  let val = element.value;
  if(!val) return fallback;
  //TODO: add negative number check
  return Math.floor(val*scale);
}

document.getElementById("calc_result").onclick = function(){
  //use 10x scale, all input values expected positive in app input
  let gap_penalty = read_number(gap_penalty_box,1,10);
  let min_gap = read_number(min_gap_box,3,1);
  let au_score = read_number(weight_au_box,20,10);
  let gu_score = read_number(weight_gu_box,20,10);
  let gc_score = read_number(weight_gc_box,30,10);
  
  let input_string = input_box.value;
  let match = input_regex.exec(input_string);
  if(!match || match[1].length == 0){
    //TODO: highlight error on box, instead of alert
    alert("Sequence must be made up of A,U,G,C");
    return;
  }
  let sequence = match[1];
  
  set_weights(gap_penalty, min_gap, au_score, gu_score, gc_score);
  find_minimums(sequence);
  let seq_structures = ""
  let num_mins = number_minimums();
  for(let i=0; i < num_mins; i++){
    seq_structures += get_minimum(i) + "\n";
  }
  
  result_seq_box.value = seq_structures;
  result_score_box.value = minimum_score()/10;
};

