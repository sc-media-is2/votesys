//投票画面のjsファイル
/*-------------------------------*/
let Year = 2020;

//このリストは予測候補と入力時の名前のエラーチェックと再投票防止に使います。
//毎年更新をお願いします。
var name_list = {
  'Ghita':['Ghita','Ghita','ghita','ギータ','ぎーた'],
  'Kase':['加瀬','Kase','kase','カセ','かせ'],
  'Seki':['関','Seki','seki','セキ','せき'],
  'Zhang':['張','Zhang','zhang','チョウ','ちょう'],
  'Ogino':['荻野','Ogino','ogino','オギノ','おぎの'],
  'Ikeda':['池田','Ikeda','ikeda','イケダ','いけだ'],
  'Maemoto':['前本','Maemoto','maemoto','マエモト','まえもと'],
  'Sakamoto':['坂元','Sakamoto','sakamoto','サカモト','さかもと'],
  'Gotou':['後藤','Gotou','gotou','ゴトウ','ごとう'],
  'Kobayashi':['小林','Kobayashi','kobayashi','コバヤシ','こばやし'],
  'Ueda':['植田','Ueda','ueda','ウエダ','うえだ'],
  'Ni':['倪','Ni','ni','ニー','にー'],
  'Matsubara':['松原','Matsubara','matsubara','マツバラ','まつばら']
};

//PとFGの人数
//指定した数だけフォームに入力できる & firebaseにデータが送信される、ようにしたいな。
var p_num = 5;
var fg_num = 5;
/*-------------------------------*/



//各入力フォームの名前が正しいかの確認用のフラグ
var p1_flag = 0;
var p2_flag = 0;
var p3_flag = 0;
var p4_flag = 0;
var p5_flag = 0;
var fg1_flag = 0;
var fg2_flag = 0;
var fg3_flag = 0;
var fg4_flag = 0;
var fg5_flag = 0;


//入力フォーム内にここに書かれていない文字列が入ると赤色に変化する
var list = [];
Object.keys(name_list).forEach(function(key) {
  this[key].forEach(function(val) {
    list.push(val);
  });
}, name_list);

var name_list_forMap = [];
Object.keys(name_list).forEach(function(key) {
  var names = [];
  this[key].forEach(function(val) {
    names.push(val);
  });
  name_list_forMap.push([key, names]);
}, name_list);

const dictMap2 = new Map();
name_list_forMap.forEach(row => {
  row[1].forEach(name => dictMap2.set(name, row[0]))
});

/*
[
    ["Ghita", ["ghita", "Ghita","ギータ","ぎーた"]],
    ["Koyama", ["koyama", "Koyama", "小山", "こやま"]],
    ["Mochida", ["mochida", "Mochida", "持田", "もちだ"]],
    ["Yao", ["yao", "Yao", "you","You","姚", "よう"]],
    ["Kase", ["kase", "Kase", "加瀬", "かせ"]],
    ["Seki", ["seki", "Seki", "関", "せき"]],
    ["Zhang", ["zhang","Zhang","chou", "Chou", "張", "ちょう"]],
    ["Ogino", ["ogino", "Ogino", "荻野", "おぎの"]],
    ["Ikeda", ["ikeda", "Ikeda", "池田", "いけだ"]],
    ["Maemoto", ["maemoto", "Maemoto", "前本", "まえもと"]],
    ["Sakamoto", ["sakamoto", "Sakamoto", "坂元", "さかもと"]],
    ["Kobayashi", ["kobayashi", "Kobayashi", "小林", "こばやし"]],
    ["Gotou", ["gotou", "Gotou", "後藤", "ごとう"]],
    ["Ueda", ["ueda", "Ueda", "植田", "うえだ"]],
    ["Ni", ["ni", "Ni", "ニー", "にー"]],
    ["Matsubara", ["matsubara", "Matsubara", "松原", "まつばら"]],
  ].forEach(row => {
    row[1].forEach(name => dictMap2.set(name, row[0]))
  });
  */

//firebase内の投票データからその日投票済みの人の名前を取得して格納するリスト。再投票を禁止するために使用。
var voters_list = [];

//selfID:投票者のID。ログイン時にデータベース(user_name/<year>)より取得して割り当てられる。
//const db = firebase.firestore();
var login_user_email = "";
getUserName(db,'/user_name/'+String(Year));
var selfID = "";



// 入力フォーム内に入力された名前を確認、listに登録されたもの以外が入ると赤色に変化する。
function submit(thisId){
  var value = document.getElementById(thisId).value;
  
  if(list.indexOf(value) >= 0){
    document.getElementById(thisId).style.backgroundColor = "#FFFFFF";
    switch(thisId){
      case "p1":
        p1_flag = 1;
        break;
      case "p2":
        p2_flag = 1;
        break;
      case "p3":
        p3_flag = 1;
        break;
      case "p4":
        p4_flag = 1;
        break;
      case "p5":
        p5_flag = 1;
        break;
      case "fg1":
        fg1_flag = 1;
        break;
      case "fg2":
        fg2_flag = 1;
        break;
      case "fg3":
        fg3_flag = 1;
        break;
      case "fg4":
        fg4_flag = 1;
        break;
      case "fg5":
        fg5_flag = 1;
        break;
    }
    return true;
  }else{
    document.getElementById(thisId).style.backgroundColor = "mistyrose";
    switch(thisId){
      case "p1":
        p1_flag = 0;
        break;
      case "p2":
        p2_flag = 0;
        break;
      case "p3":
        p3_flag = 0;
        break;
      case "p4":
        p4_flag = 0;
        break;
      case "p5":
        p5_flag = 0;
        break;
      case "fg1":
        fg1_flag = 0;
        break;
      case "fg2":
        fg2_flag = 0;
        break;
      case "fg3":
        fg3_flag = 0;
        break;
      case "fg4":
        fg4_flag = 0;
        break;
      case "fg5":
        fg5_flag = 0;
        break;
    }
    return false;
  }
}


function connecttext(textid_list,  checkboxid_list ) {  
  var ischecked_list = checkboxid_list.map(id => document.getElementById(id).checked);
  if( ischecked_list.every(value => value == true) ) {
    // チェックが入っていたら有効化
    for (let item of textid_list) {
      document.getElementById(item).disabled = false;
      document.getElementById(item).style.borderColor = "#000000";
    }
  }
  else {
    // チェックが入っていなかったら無効化
    for (let item of textid_list) {
      document.getElementById(item).disabled = true;
    }
  }
}

var check_p_list = [
  "check_p1",
  "check_p2",
  "check_p3",
  "check_p4",
  "check_p5",
];
var text_p_list = [
  "p1",
  "p2",
  "p3",
  "p4",
  "p5",
  "submit_vote",
];
var check_fg_list = [
  "check_fg1",
  "check_fg2",
  "check_fg3",
];
var text_fg_list = [
  "fg1",
  "fg2",
  "fg3",
  "fg4",
  "fg5",
  "submit_vote",
]

/*
// チェックボックスを全てチェックすると入力フォームがabledになる
function p_checkbox_check(){
  var check_list = new Array(5);
  
  check_list[0] = document.getElementById("check_p1").checked;
  check_list[1] = document.getElementById("check_p2").checked;
  check_list[2] = document.getElementById("check_p3").checked;
  check_list[3] = document.getElementById("check_p4").checked;
  check_list[4] = document.getElementById("check_p5").checked;
  
  // チェックボックスの状態を確認
  // 押されていないものがあれば名前を入力できない
  var check_flag = 0;
  for(var i = 0; i < check_list.length; i++){
    if(check_list[i] != true){
      check_flag = 1;
      break;
    }
  }
  
  // 全てのチェックボックスがチェックされていたら入力できるようにする
  var p_form = ['p1','p2','p3','p4','p5','p6'];
  
  if(check_flag == 0){
    for(var i=0; i<p_num; i++){
      document.p_form.elements[i].disabled = false;
      //document.fg_form.elements[i].disabled = false;
      document.getElementById(p_form[i]).style.borderColor = "#000000";
    }
  }else if(check_flag != 0){
    for(var i=0; i<p_num; i++){
      document.p_form.elements[i].disabled = true;
      //document.fg_form.elements[i].disabled = true;
    }
  }
}


function fg_checkbox_check(){
  var check_list = new Array(3);
  
  check_list[0] = document.getElementById("check_fg1").checked;
  check_list[1] = document.getElementById("check_fg2").checked;
  check_list[2] = document.getElementById("check_fg3").checked;
  
  // チェックボックスの状態を確認
  // 押されていないものがあれば名前を入力できない
  var check_flag = 0;
  for(var i = 0; i < check_list.length; i++){
    if(check_list[i] != true){
      check_flag = 1;
      break;
    }
  }
  
  // 全てのチェックボックスがチェックされていたら入力できるようにする
  var fg_form = ['fg1','fg2','fg3','fg4','fg5','fg6'];
  
  if(check_flag == 0){
    for(var i=0; i<fg_num; i++){
      //document.p_form.elements[i].disabled = false;
      document.fg_form.elements[i].disabled = false;
      document.getElementById(fg_form[i]).style.borderColor = "#000000";
    }
  }else if(check_flag != 0){
    for(var i=0; i<fg_num; i++){
      //document.p_form.elements[i].disabled = true;
      document.fg_form.elements[i].disabled = true;
    }
  }
}
//setInterval(p_checkbox_check,1000);
//setInterval(fg_checkbox_check,1000);
// 1秒ごとにチェックボックスの状態を確認。全てチェックしたらボタンを押せるようにする。
function flag_check(){
  var check_list = new Array(8);

  check_list[0] = document.getElementById("check_p1").checked;
  check_list[1] = document.getElementById("check_p2").checked;
  check_list[2] = document.getElementById("check_p3").checked;
  check_list[3] = document.getElementById("check_p4").checked;
  check_list[4] = document.getElementById("check_p5").checked;
  check_list[5] = document.getElementById("check_fg1").checked;
  check_list[6] = document.getElementById("check_fg2").checked;
  check_list[7] = document.getElementById("check_fg3").checked;
  
  // チェックボックスの状態を確認
  // 押されていないものがあれば名前を入力できない
  var check_flag = 0;
  for(var i = 0; i < check_list.length; i++){
    if(check_list[i] != true){
      check_flag = 1;
      break;
    }
  }
  
  
  //if(check_flag == 0 && 
  //   (p1_flag + p2_flag + p3_flag + p4_flag == p_num) &&
  //   (fg1_flag + fg2_flag + fg3_flag + fg4_flag == fg_num)){
  
  if(check_flag == 0){
    document.send.elements[0].disabled = false;
  }else{
    document.send.elements[0].disabled = true;
  }
}
setInterval(flag_check,1000);
*/


// 投票ボタンを押した時の処理
async function btn_send(){  
  
  /* firebaseにデータを送信 */
  //テキストボックスのidをまとめた配列。検索しやすくするために用意した。
  var p_form = ['p1','p2','p3','p4','p5'];
  var fg_form = ['fg1','fg2','fg3','fg4','fg5'];
  //各テキストボックスの値を記録するための配列。
  var p_form_value = new Array(5);
  var fg_form_value = new Array(5);
  
  //PとFGの数だけテキストボックスの値を取得
  for(let i=0; i<p_num; i++){
    p_form_value[i] = document.getElementById(p_form[i]).value;
  }
  for(let i=0; i<fg_num; i++){
    fg_form_value[i] = document.getElementById(fg_form[i]).value;
  }
    
  
  // 自分の名前が入力されている xor 複数同じ名前が含まれている xor 間違った名前が入力されていると投票できなくなる。
  
  // 複数同じ名前が含まれているかのチェック
  var p_fg_form_value = p_form_value.concat(fg_form_value);
  var multipleCheck = p_fg_form_value.filter(
  function (x, i, self) {
    return self.indexOf(x) === i && i !== self.lastIndexOf(x);
  });
  
  // 間違った名前が入力されているかのチェック
  var count_p_num = 0;
  for(let i = 0; i < p_num; i++){
    if(p_form_value[i] != "") {
      count_p_num += 1;
    }
  }
  var count_fg_num = 0;
  for(let i = 0; i < fg_num; i++){
    if(fg_form_value[i] != "") {
      count_fg_num += 1;
    }
  }
  
  var p_num_check = false;
  if(p1_flag+p2_flag+p3_flag+p4_flag+p5_flag == count_p_num){
    p_num_check = true;
  }
  var fg_num_check = false;
  if(fg1_flag+fg2_flag+fg3_flag+fg4_flag+fg5_flag == count_fg_num){
    fg_num_check = true;
  }
  
  //再投票を禁止する（既にfirebaseに自分が投票したデータが有る場合は送信できなくする） 
  //ここで投票済みの人物のリストを作り、下のif文内のvoters_list.indexOf(selfID)<0で投票済みかをチェックする
  voters_list = [];
  await checkRevote();
  
  if(p_form_value.indexOf(selfID) < 0 && fg_form_value.indexOf(selfID) < 0 && 
     multipleCheck <= 0 && p_num_check && fg_num_check && count_p_num != 0 && 
     count_fg_num != 0 && voters_list.indexOf(selfID) < 0){
    //各フォームのデータを成形してfirebaseに送信
    for(let i = 0; i < p_num; i++){
      if(p_form_value[i] != "") {
        var p_voteData = {
          votersId: dictMap2.get(selfID),
          votedId: dictMap2.get(p_form_value[i]),
          voteRank: i+1,
          role: "Presentor",
        };
        await addVoteData(p_voteData);
      }
    }
    for(let i = 0; i < fg_num; i++){
      if(fg_form_value[i] != ""){
        var fg_voteData = {
          votersId: dictMap2.get(selfID),
          votedId: dictMap2.get(fg_form_value[i]),
          voteRank: i+1,
          role: "Facilitator",
        };
        await addVoteData(fg_voteData);
      }
    }

    //投票結果画面へ遷移
    var move = function(){
      window.location.href = "result.html"
    } 
    setTimeout(move, 1200);
  }else{
    const checks = document.getElementsByClassName('check');
    checks[0].innerHTML = "自分の名前や間違った名前、同じ名前を複数個入力している可能性があります。";
    //alert('自分の名前や間違った名前、同じ名前を複数個入力している可能性があります。');
  }
}

 
//dbからデータを取得してその日投票済みの人の一覧を作る。
//張くんのコードを引用しました。
async function checkRevote(){
  var voters = [];
  
  let todayTimestamp = getTodayTimestamp();
  var docRef = db.doc('vote_data/' + [todayTimestamp] + '/');
  await docRef
    .get()
    .then(function(doc) {
      if (doc.exists) {
        var docData = doc.data();
        for (let votersId in docData) {
          voters.push(votersId);
        };
        voters_list = voters;
      };
  });
};


async function predict(thisInput,thisUl){  
  const input = document.getElementById(thisInput);
  const ul = document.getElementById(thisUl);
  const dictMap = new Map(name_list_forMap);
  
  dictMap.forEach((v, key) => {
    
    const li = document.createElement("li");
    li.innerHTML = key;
    li.style.display = "none";
    
    // 候補部分をクリックした時
    li.onclick = () => {
      // 1回目の処理
      input.value = li.innerHTML;
      submit(thisInput);
      for (let i = 0; i < ul.children.length; ++i) {
        ul.children[i].style.display = "none";
      }
      
      // 2回目以降
      input.onblur = () => {
        window.setTimeout(
          (function(){
            for (let i = 0; i < ul.children.length; ++i) {
              ul.children[i].style.display = "none";
            }
          })
        ,200);
        window.setTimeout((function(){submit(thisInput)}),100);
      };
      
    };
    ul.appendChild(li);
  });
  
  // フォームに文字を入力した時
  input.onkeyup = () => {
    const str = input.value;
    let idx = 0;
    dictMap.forEach((arr, key) => {
      if (
        str !== ""
        && arr.reduce((acc, cur) => acc || cur.indexOf(str) === 0, false)
      ) {
        ul.children[idx].style.display = "block";
      } else {
        ul.children[idx].style.display = "none";
      }
      ++idx;
    });
    
    input.onblur = () => {
        window.setTimeout(
          ()=>{
            for (let i = 0; i < ul.children.length; ++i) {
              ul.children[i].style.display = "none";
            }
          }
        ,200);
        window.setTimeout(()=>{submit(thisInput)},100);
      };
    
  };
}

/*
//ここから下追加しました(関)
function addValue(thisId){
  let input_sent;//中のtext格納する変数
  //console.log(thisId.id)
  //datalistの情報を取得
  let U = window.document.getElementById("my-friends"+thisId.id)//Uでdatalist内のデータを取得
  //内部に要素がある場合
  if(U.innerHTML!=null){
    //要素を空にする
    U.innerHTML="";
  }
  //console.log(U);
  //console.log(window.document.getElementById("opt")!=null);
  //id="neko"(今回はinput)要素を受け取る
  let idname = thisId.id//idの取得
  //要素の値をinput_sentへ
  input_sent = document.getElementById(idname).value;
  //console.log(input_sent);
  //これが予測変換用の辞書
  const names={
               'seki':'Seki',
               'mochida':'Mochida', 
               'kase':'Kase', 
               'chou':'Chou',
               'you':'You',
               'koyama':'Koyama',
               'ghita':'Ghita',
               'ogino':'Ogino',
               'ikeda':'Ikeda',
               'sakamoto':'Sakamoto',
               'maemoto':'Maemoto',
               'Seki':'Seki',
               'Mochida':'Mochida', 
               'Kase':'Kase', 
               'Chou':'Chou',
               'You':'You',
               'Koyama':'Koyama',
               'Ghita':'Ghita',
               'Ogino':'Ogino',
               'Ikeda':'Ikeda',
               'Sakamoto':'Sakamoto',
               'Maemoto':'Maemoto',
              }
              
  //const names = ['関', '持田', '加瀬', '張','姚','小山','Ghita','荻野','池田','坂元','前本','せき','もちだ'];
  //配列内の単語でfor
  for(let key in names){
    //もしも、配列内の要素の一番初めの要素が合致していた場合(現段階では先頭要素のみ←と思っていたが、後ろ要素はautocompleteが自動的に見てくれているので実質全体見れている)
    if(String(key).charAt(0)==input_sent.charAt(0)){
      //datalist内部のoption要素の作成(これが予測変換として表示される)
      let option = document.createElement('option');
      option.id="opt"+thisId.id;//idの設定
      //console.log(option);
      //optionの値を設定する
      option.value = String(names[key]);//辞書のValueをlistに追加
      option.innerHTML = String(names[key]);
      //console.log(toString.call(option.value));
      //console.log(option.value);
      //datalist内に追加
      U.appendChild(option);//子要素としてappendする
    }
    
  }
  
}
*/

// 6秒ごとに自分の最終ログイン状態をアップデート
setInterval(function(){return showParticipant(db)}, 6*1000);

// 10秒ごとに自分の最終ログイン状態をアップデート
setInterval(function(){return updateStatus(db, getTodayTimestamp())}, 10*1000);

// 30秒ごとにログイン状態をチェックして、ログインしていなかったらログインを強制する
setInterval(function(){return loggedin2(firebase)}, 30*1000);

function PageLoad(){
  console.log("page loaded");
  loggedin2(firebase);
  showParticipant(db);
};
