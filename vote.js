//投票画面のjsファイル
/*-------------------------------*/
const YEAR = 2020;

//このリストは予測候補と入力時の名前のエラーチェックと再投票防止に使います。
//毎年更新をお願いします。
const NAME_LIST = {
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

//PとFGの人数(ここを変更すると入力フォームの数が変わります)
//指定した数だけフォームに入力できる & firebaseにデータが送信される、ようにしたいな。
const P_NUM = 6;
const FG_NUM = 6;
/*-------------------------------*/

//各入力フォームの名前が正しいかの確認用のフラグ
//人数では？
let p_flag = Array(P_NUM).fill(0);
let fg_flag = Array(FG_NUM).fill(0);

//名前探索用
let all_members_name=[];
Object.keys(NAME_LIST).forEach(function(key) {
  this[key].forEach(function(val) {
    all_members_name.push(val);
  });
}, NAME_LIST);


let name_list_forMap = [];
Object.keys(NAME_LIST).forEach(function(key) {
  let names = [];
  this[key].forEach(function(val) {
    names.push(val);
  });
  name_list_forMap.push([key, names]);
}, NAME_LIST);

//固定ID変換用
const dictMap2 = new Map();
name_list_forMap.forEach(row => {
  row[1].forEach(name => dictMap2.set(name, row[0]))
});

//firebase内の投票データからその日投票済みの人の名前を取得して格納するリスト。再投票を禁止するために使用。
let voters_list = [];

//selfID:投票者のID。ログイン時にデータベース(user_name/<year>)より取得して割り当てられる。
//const db = firebase.firestore();
let login_user_email = "";
getUserName(db,`/user_name/${YEAR}`);
let selfID = "";


// 入力フォーム内に入力された名前を確認、all_members_nameに登録されたもの以外が入ると赤色に変化する。
function submit(thisId){
  const name = document.getElementById(thisId).value;
  let p_ids = Array(P_NUM).fill().map((_, i) => `p${i+1}`);
  let fg_ids = Array(FG_NUM).fill().map((_, i) => `fg${i+1}`);
  
  if(all_members_name.indexOf(name) >= 0){
    document.getElementById(thisId).style.backgroundColor = "#FFFFFF";
    
    for(let i=0; i<P_NUM; i++) {
      if(thisId === p_ids[i]) {
        p_flag[i] = 1;
      }
    }
    
    for(let i=0; i<FG_NUM; i++) {
      if(thisId === fg_ids[i]) {
        fg_flag[i] = 1;
      }
    }
    
    return true;
    
  }else{
    document.getElementById(thisId).style.backgroundColor = "mistyrose";
    
    for(let i=0; i<P_NUM; i++) {
      if(thisId == p_ids[i]) {
        p_flag[i] = 0;
      }
    }
    
    for(let i=0; i<FG_NUM; i++) {
      if(thisId == fg_ids[i]) {
        fg_flag[i] = 0;
      }
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

//文言チェック用
let text_p_list = [];
let text_fg_list = [];
var check_p_list = [
  "check_p1",
  "check_p2",
  "check_p3",
  "check_p4",
  "check_p5",
];
for(let i=0; i<P_NUM; i++) {
  text_p_list[i] = `p${i+1}`;
}
text_p_list.push("submit_vote");

var check_fg_list = [
  "check_fg1",
  "check_fg2",
  "check_fg3",
];
for(let i=0; i<FG_NUM; i++) {
  text_fg_list[i] = `fg${i+1}`;
}
text_fg_list.push("submit_vote");

async function btn_send(){
  //テキストボックスのidをまとめた配列。検索しやすくするために用意した
  let p_form = Array(P_NUM).fill().map((_, i) => `p${i+1}`);
  let fg_form = Array(FG_NUM).fill().map((_, i) => `fg${i+1}`);

  //各テキストボックスの値を記録するための配列
  let p_form_value = [];
  let fg_form_value = [];
  
  //PとFGの数だけテキストボックスの値を取得
  for(let i=0; i<P_NUM; i++){
    p_form_value[i] = document.getElementById(p_form[i]).value;
  }
  for(let i=0; i<FG_NUM; i++){
    fg_form_value[i] = document.getElementById(fg_form[i]).value;
  }

  // 複数同じ名前が含まれているか
  function checkSameName(p_form_value, fg_form_value){
    let p_fg_form_value = p_form_value.concat(fg_form_value);
    let collisionName = p_fg_form_value.filter(
      function (x, i, self) {
        return self.indexOf(x) === i && i !== self.lastIndexOf(x);
      });
    return collisionName.length;
  }
  
  // 間違った名前が入力されているか
  function checkMistakeNumberOfMember(p_form_value, fg_form_value){
    function Counter(array) {
      var count = {};
      array.forEach(val => count[val] = (count[val] || 0) + 1);
      return count;
    }

    let count_p_num = 0;
    for(let i = 0; i < P_NUM; i++){
      if(p_form_value[i] != "") {
        count_p_num += 1;
      }
    }
    let count_fg_num = 0;
    for(let i = 0; i < FG_NUM; i++){
      if(fg_form_value[i] != "") {
        count_fg_num += 1;
      }
    }

    //member_overflow: 人数が溢れる場合はtrue
    let p_member_overflow = false;
    let fg_member_overflow = false;
    let p_flag_count = Counter(p_flag).true;
    let fg_flag_count = Counter(fg_flag).true;
    if(p_flag_count !== count_p_num){
      p_member_overflow = true;
    }
    if(fg_flag_count !== count_fg_num){
      fg_member_overflow = true;
    }

    //どちらもfalseでなければならない
    return(p_member_overflow || fg_member_overflow);
  }
  
  //再投票を禁止する（既にfirebaseに自分が投票したデータが有る場合は送信できなくする） 
  //ここで投票済みの人物のリストを作り、下のif文内のvoters_list.indexOf(selfID)<0で投票済みかをチェックする
  voters_list = [];
  await checkRevote();
  
  //自分が入っていない && 重複する名前がない && 間違った入力がない && 入力が0でない
  if(p_form_value.indexOf(selfID) < 0 && fg_form_value.indexOf(selfID) < 0 && 
     checkSameName(p_form_value, fg_form_value) === 0 && !checkMistakeNumberOfMember(p_form_value, fg_form_value) && 
     count_p_num !== 0 && count_fg_num !== 0 && voters_list.indexOf(selfID) < 0){
    //各フォームのデータを成形してfirebaseに送信
    for(let i = 0; i < P_NUM; i++){
      if(p_form_value[i] != "") {
        const p_voteData = {
          votersId: dictMap2.get(selfID),
          votedId: dictMap2.get(p_form_value[i]),
          voteRank: i+1,
          role: "Presentor",
        };
        await addVoteData(p_voteData);
      }
    }
    for(let i = 0; i < FG_NUM; i++){
      if(fg_form_value[i] != ""){
        const fg_voteData = {
          votersId: dictMap2.get(selfID),
          votedId: dictMap2.get(fg_form_value[i]),
          voteRank: i+1,
          role: "Facilitator",
        };
        await addVoteData(fg_voteData);
      }
    }

    //投票結果画面へ遷移
    const move = function(){
      window.location.href = "result.html"
    } 
    setTimeout(move, 1200);
  }else{
    console.log(fg_form_value);
    console.log(p_form_value);
    const checks = document.getElementsByClassName('check');
    checks[0].innerHTML = "自分の名前や間違った名前、同じ名前を複数個入力している可能性があります。";
    window.scrollTo(0,0);
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
