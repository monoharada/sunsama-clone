# Supabase セットアップガイド

## 1. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com/)にアクセスしてアカウントを作成
2. 新しいプロジェクトを作成
3. プロジェクトのURLとAnon Keyをコピー

## 2. 環境変数の設定

`.env`ファイルを作成し、以下の内容を記入：

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## 3. データベーススキーマの適用

Supabaseダッシュボードで：

1. 左メニューから「SQL Editor」を選択
2. `supabase/migrations/20231227000000_initial_schema.sql`の内容をコピー
3. 実行ボタンをクリック

## 4. Google OAuth の設定

### Google Cloud Console での設定

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成（または既存のプロジェクトを選択）
3. 「APIとサービス」→「認証情報」に移動
4. 「認証情報を作成」→「OAuthクライアントID」を選択
5. アプリケーションの種類：「ウェブアプリケーション」
6. 承認済みのリダイレクトURIを追加：
   - `https://your-project-ref.supabase.co/auth/v1/callback`
7. クライアントIDとクライアントシークレットをコピー

### Supabaseでの設定

1. Supabaseダッシュボードの「Authentication」→「Providers」に移動
2. 「Google」を有効化
3. クライアントIDとクライアントシークレットを入力
4. 保存

## 5. Google Calendar API の有効化

1. Google Cloud Consoleで「APIとサービス」→「ライブラリ」に移動
2. 「Google Calendar API」を検索
3. 有効化

## 完了！

これで、Sunsama Cloneアプリケーションの準備が整いました。
`npm run dev`でアプリケーションを起動できます。
