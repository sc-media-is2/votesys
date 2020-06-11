# ゼミ用投票システム

- index.html がメインファイル
- login.html がログイン用
- utilslib.js が全体用の
- vote_style.css が全体の CSS

## 研究室の3名での制作

vote 画面一人

result 画面一人

データベース構築一人

## `XXXX.html` ファイルの head 内の js ファイルの読み込み順序(← 移行は未完成)

必ず以下の順番で読み込んでください

1. `/read_firebase.js` ← これは firebase の設定を読み込むための js ファイル
1. `/utilslib.js` ← これは関数だけを置くための js ファイル
1. `/XXXX.js` ← 　ここの XXXX は読み込ませたい html ファイルの名前と一致、このファイルの中に特定ページの処理を書く

## 実現した機能

- メアド+パスワードで管理、firebase のアカウント管理機能に委託
- プレゼンターとファシリテータの要チェック項目をチェックしないと投票できない
- 自分に投票出来ない
- 同じ人に複数票入れられない
- 再投票できない(結果を見た後に投票内容を変更できない)

## `firestore`のデータ構造

```
voting-system-6d23d
  |-- vote_data (投票データのcollection)
  |     |-- day_timestamp (投票日のタイムスタンプごとにdocumentがある)
  |     |     |-- voters_id_1 (投票者のIDがkey)
  |     |     |     |-- voted_id_1 (被投票者のID)
  |     |     |     |     |-- role (被投票者の役割)
  |     |     |     |     |-- updated_at (投票データがアップデートされた時間)
  |     |     |     |     |-- vote_rank (何位か)
  |     |     |     |-- voted_id_2 (被投票者のID)
  |     |     |     |     |-- role (被投票者の役割)
  |     |     |     |     |-- updated_at (投票データがアップデートされた時間)
  |     |     |     |     |-- vote_rank (何位か)
  |     |     |     |-- . . .
  |     |     |     |-- . . .
  |     |     |-- voters_id_2
  |     |     |-- . . .
  |     |-- . . .
  |     |-- . . .
  |-- todays_participant (今日の参加者情報)
  |     |-- day_timestamp (投票日のタイムスタンプごとにdocumentがある)
  |     |     |-- name_1(出席者の名前がkey) : 最終ログインのタイムスタンプ
  |     |     |-- name_2
  |     |     |-- . . .
  |     |-- . . .
  |     |-- . . .
  |-- user_name (ユーザ名情報)
  |--

```

## to do list

- 当日の参加者だけに投票できるようにする
  - 現状、発表にしていない人にも投票できる
- P と FG の違いをチェックできるようにする

  - 現状、どの役割の人で任意に入れて送信が可能

## 注意事項

− 研究室のメンバーが変わったら、<br>
- 新メンバーの皆さんにメールアドレスとパスワードを登録してもらう→firestoreのuser_nameに登録(user_nameを新年度用に更新する)<br>
- vote.jsのリストname_listを更新 ＆ result.jsとvote.jsの変数Yearの値を更新する
- PとFGの入力フォームの数はvote.jsのp_numとfg_numを変えることで変更可(多めに設定しても大丈夫です)
