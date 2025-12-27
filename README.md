# Sunsama Clone

Web Components + htmx + Supabase で構築された、Sunsama 風のタスク管理アプリケーション。

## 特徴

- 🌐 **ウェブスタンダード**: フレームワークレス、Web Components で実装
- ⚡ **高速**: Vite + TypeScript でモダンな開発体験
- 🎨 **モダンUI**: Tailwind CSS でスタイリング
- 🔐 **認証**: Supabase Auth + Google OAuth
- 💾 **データベース**: Supabase (PostgreSQL) でマルチデバイス対応
- 📱 **レスポンシブ**: モバイル・デスクトップ両対応
- 📅 **Google カレンダー連携**: タスクをカレンダーと同期（予定）

## 主な機能

- ✅ タスクの作成・編集・削除（CRUD）
- 🏷️ チャンネル（カテゴリ）でタスクを整理
- 📝 サブタスクの管理
- ⏱️ 見込み時間の設定
- 📆 タスクの日付設定
- 🖱️ ドラッグ&ドロップでタスクを移動
- 📅 Google カレンダー連携（実装予定）

## 技術スタック

### フロントエンド
- **Vanilla TypeScript** - 型安全な開発
- **Web Components** - 再利用可能なカスタム要素
- **htmx** - サーバーとの簡単な通信
- **Tailwind CSS** - ユーティリティファーストのCSS
- **Vite** - 高速なビルドツール

### バックエンド
- **Supabase** - BaaS（Backend as a Service）
  - PostgreSQL データベース
  - リアルタイム同期
  - Row Level Security (RLS)
  - Google OAuth 認証

## セットアップ

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd sunsama-clone
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 開発モード（推奨：Supabase なしで UI を確認）

フロントエンドのUIを素早く確認したい場合は、開発モードを使用できます。
Supabase のセットアップや認証なしで、モックデータを使ってアプリを起動できます。

#### 開発モードの起動方法

1. `.env` ファイルを作成：

```bash
cp .env.example .env
```

2. `.env` ファイルで開発モードを有効化（デフォルトで有効）：

```env
VITE_DEV_MODE=true
```

3. 開発サーバーを起動：

```bash
npm run dev
```

4. ブラウザで http://localhost:5173 を開く

#### 開発モードの特徴

- ✅ **認証不要** - Google OAuth やログインなしで使用可能
- ✅ **サンプルデータ** - 3つのタスクが事前に用意されています
- ✅ **即座に確認** - Supabase のセットアップなしでUIを確認
- ✅ **完全な機能** - タスクの作成・編集・削除が可能（メモリ内保存）
- ⚠️ **データは一時的** - ページをリロードするとデータは初期状態に戻ります

開発モードは UI の確認やフロントエンド開発に最適です。
本番環境のような永続的なデータ保存が必要な場合は、次の「Supabase プロジェクトのセットアップ」に進んでください。

### 4. Supabase プロジェクトのセットアップ（本番環境用）

本番環境のように永続的なデータ保存や複数デバイス間での同期が必要な場合は、Supabase をセットアップします。

詳細は [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) を参照してください。

1. [Supabase](https://supabase.com/) でプロジェクトを作成
2. データベーススキーマを適用（`supabase/migrations/20231227000000_initial_schema.sql`）
3. Google OAuth を設定

### 5. 環境変数の設定（本番環境用）

`.env` ファイルで以下の環境変数を設定：

```env
# 開発モードを無効化
VITE_DEV_MODE=false

# Supabase の設定
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Google OAuth の設定
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

開発サーバーを再起動すると、Supabase と接続されます。

## ビルド

```bash
npm run build
```

ビルドされたファイルは `dist/` ディレクトリに出力されます。

## プロジェクト構造

```
sunsama-clone/
├── src/
│   ├── components/       # Web Components
│   │   ├── app-shell.ts      # アプリケーションのシェル
│   │   ├── auth-button.ts    # 認証ボタン
│   │   ├── task-card.ts      # タスクカード
│   │   ├── task-list.ts      # タスクリスト
│   │   └── task-modal.ts     # タスク追加/編集モーダル
│   ├── lib/              # ユーティリティとヘルパー
│   │   ├── auth.ts           # 認証関連の関数
│   │   ├── database.ts       # データベース操作
│   │   ├── mock-database.ts  # モックデータベース（開発モード用）
│   │   ├── config.ts         # アプリケーション設定
│   │   ├── supabase.ts       # Supabase クライアント
│   │   ├── base-component.ts # Web Components の基底クラス
│   │   └── htmx-helper.ts    # htmx ヘルパー関数
│   ├── types/            # TypeScript 型定義
│   │   └── index.ts
│   ├── styles/           # スタイル
│   │   └── main.css
│   └── main.ts           # エントリーポイント
├── supabase/
│   └── migrations/       # データベースマイグレーション
├── .env.example          # 環境変数のサンプル
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## データベーススキーマ

### テーブル

- **profiles** - ユーザープロフィール（Supabase Auth と連携）
- **channels** - タスクのカテゴリ
- **tasks** - タスク
- **subtasks** - サブタスク

詳細は `supabase/migrations/20231227000000_initial_schema.sql` を参照。

## 今後の予定

- [ ] Google カレンダー連携の完全実装
- [ ] ドラッグ&ドロップ機能の強化
- [ ] タスクの並び替え機能
- [ ] 週次/月次ビュー
- [ ] タスクの繰り返し設定
- [ ] 通知機能
- [ ] ダークモード
- [ ] オフライン対応（PWA）

## ライセンス

MIT

## 貢献

プルリクエストを歓迎します！大きな変更の場合は、まず Issue を開いて変更内容を議論してください。
