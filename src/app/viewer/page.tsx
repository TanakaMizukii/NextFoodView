// app/other/page.tsx
export default function OtherPage() {
return (
<main style={{ padding: 24, color: '#fff' }}>
<h1>その他の端末</h1>
<p>お使いの端末を自動判定できませんでした。iPhone/Android いずれかを選んでください。</p>
<ul>
<li><a href="/ios">iPhone の方はこちら</a></li>
<li><a href="/android">Android の方はこちら</a></li>
</ul>
</main>
);
}