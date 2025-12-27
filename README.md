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

### 3. Supabase プロジェクトのセットアップ

詳細は [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) を参照してください。

1. [Supabase](https://supabase.com/) でプロジェクトを作成
2. データベーススキーマを適用（`supabase/migrations/20231227000000_initial_schema.sql`）
3. Google OAuth を設定

### 4. 環境変数の設定

`.env` ファイルを作成：

```bash
cp .env.example .env
```

以下の環境変数を設定：

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:5173 を開きます。

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
