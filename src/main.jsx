import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const initialItems = [
  { name: 'Watermelon Mojito', qty: 1, price: 255 },
  { name: 'Wok-tossed Prawn', qty: 1, price: 765 },
  { name: 'Steamed Rice', qty: 1, price: 315 },
  { name: 'Chilli Chicken Bowl', qty: 1, price: 475 },
  { name: 'Chilli Garlic Crispy Vegetables', qty: 1, price: 525 },
  { name: 'Bottled Water', qty: 1, price: 95.2 },
];
const localDateTime = () => {
  const date = new Date();
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};
const money = (value) => (Number(value) || 0).toFixed(2);

function App() {
  const [screen, setScreen] = useState(1);
  const [receipt, setReceipt] = useState({
    business: 'Bercos (Noida75)',
    address: 'A Unit of GRAINS GOURMET LLP\nSF -19 SECOND FLOOR TOWER C\nSPECTRUM METRO SECTOR 75\nNOIDA CITY, UTTAR PRADESH -201304',
    phone: '9625257881', gstin: '09AAWFG7407M1ZK', fssai: '22723925001645',
    number: '21132', date: localDateTime(), customer: 'Mr Kumar', customerPhone: '8860266561',
    orderType: 'Dine In', table: '10', cashier: 'KULDEEP', sgstRate: 2.5, cgstRate: 2.5, roundOff: 0.28,
    items: initialItems,
  });
  const set = (key, value) => setReceipt((current) => ({ ...current, [key]: value }));
  const totals = useMemo(() => {
    const subtotal = receipt.items.reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.price) || 0), 0);
    const sgst = subtotal * (Number(receipt.sgstRate) || 0) / 100;
    const cgst = subtotal * (Number(receipt.cgstRate) || 0) / 100;
    return { subtotal, sgst, cgst, total: subtotal + sgst + cgst + (Number(receipt.roundOff) || 0), qty: receipt.items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0) };
  }, [receipt]);
  const date = receipt.date ? new Date(receipt.date) : new Date();
  const displayDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
  const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  const addItem = () => set('items', [...receipt.items, { name: '', qty: 1, price: 0 }]);
  const changeItem = (index, key, value) => set('items', receipt.items.map((item, i) => i === index ? { ...item, [key]: value } : item));

  return <>
    {screen === 1 ? <main className="workspace">
      <section className="form-area">
        <div className="form-heading"><div><div className="eyebrow muted">LET’S GET STARTED</div><h2>Receipt details</h2></div><span className="required-note">* REQUIRED</span></div>
        <form onSubmit={(event) => { event.preventDefault(); setScreen(2); }}>
          <section className="form-section">
            <SectionTitle icon="⌂" title="Your business" subtitle="These details appear at the top of your receipt." />
            <div className="field-grid">
              <Field label="BUSINESS NAME" required wide><input required value={receipt.business} onChange={(e) => set('business', e.target.value)} placeholder="e.g. The Corner Table" /></Field>
              <Field label="ADDRESS" wide><textarea rows="2" value={receipt.address} onChange={(e) => set('address', e.target.value)} placeholder="Street, city, state and PIN code" /></Field>
              <Field label="PHONE"><input value={receipt.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 98765 43210" /></Field>
              <Field label="GSTIN"><input value={receipt.gstin} onChange={(e) => set('gstin', e.target.value)} placeholder="15-character GSTIN" /></Field>
              <Field label={<>FSSAI LICENSE <small>OPTIONAL</small></>} wide><input value={receipt.fssai} onChange={(e) => set('fssai', e.target.value)} placeholder="14-digit license number" /></Field>
            </div>
          </section>
          <section className="form-section">
            <SectionTitle icon="▤" title="Sale details" subtitle="A few details to make this bill yours." />
            <div className="field-grid">
              <Field label="RECEIPT NO."><input value={receipt.number} onChange={(e) => set('number', e.target.value)} placeholder="e.g. 00124" /></Field>
              <Field label="DATE & TIME"><input type="datetime-local" value={receipt.date} onChange={(e) => set('date', e.target.value)} /></Field>
              <Field label="CUSTOMER NAME"><input value={receipt.customer} onChange={(e) => set('customer', e.target.value)} placeholder="Walk-in customer" /></Field>
              <Field label="CUSTOMER PHONE"><input value={receipt.customerPhone} onChange={(e) => set('customerPhone', e.target.value)} placeholder="Mobile number" /></Field>
              <Field label="ORDER TYPE"><select value={receipt.orderType} onChange={(e) => set('orderType', e.target.value)}><option>Dine In</option><option>Takeaway</option><option>Delivery</option></select></Field>
              <Field label="TABLE / ORDER"><input value={receipt.table} onChange={(e) => set('table', e.target.value)} placeholder="e.g. 10" /></Field>
              <Field label="CASHIER"><input value={receipt.cashier} onChange={(e) => set('cashier', e.target.value)} placeholder="Name" /></Field>
            </div>
          </section>
          <section className="form-section items-section">
            <div className="section-title item-title"><span className="section-icon">＋</span><div><h3>What’s on the table?</h3><p>Add each item and its price.</p></div><button type="button" className="text-button" onClick={addItem}>＋ Add item</button></div>
            <div className="items-head"><span>ITEM NAME</span><span>QTY</span><span>PRICE (₹)</span><span /></div>
            {receipt.items.map((item, index) => <div className="item-row" key={index}>
              <input value={item.name} required aria-label={`Item ${index + 1} name`} placeholder="e.g. Masala chai" onChange={(e) => changeItem(index, 'name', e.target.value)} />
              <input value={item.qty} type="number" min="1" step="1" required aria-label="Quantity" onChange={(e) => changeItem(index, 'qty', e.target.value)} />
              <div className="price-input"><span>₹</span><input value={item.price} type="number" min="0" step="0.01" required aria-label="Price" onChange={(e) => changeItem(index, 'price', e.target.value)} /></div>
              <button type="button" className="remove-item" disabled={receipt.items.length === 1} aria-label="Remove item" onClick={() => set('items', receipt.items.filter((_, i) => i !== index))}>×</button>
            </div>)}
            <div className="tax-row"><Field label="SGST (%)"><input type="number" min="0" step="0.1" value={receipt.sgstRate} onChange={(e) => set('sgstRate', e.target.value)} /></Field><Field label="CGST (%)"><input type="number" min="0" step="0.1" value={receipt.cgstRate} onChange={(e) => set('cgstRate', e.target.value)} /></Field><Field label="ROUND OFF (₹)"><input type="number" step="0.01" value={receipt.roundOff} onChange={(e) => set('roundOff', e.target.value)} /></Field></div>
          </section>
          <div className="form-actions"><span className="secure-note"><span>✦</span> Your details stay in this browser.</span><button className="primary-button" type="submit">Preview receipt <span>→</span></button></div>
        </form>
      </section>
      <div className="workspace-side-note">EST. WITH CARE &nbsp;·&nbsp; SERVED WITH STYLE</div>
    </main> : <main className="preview-screen">
      <div className="preview-head"><div><div className="eyebrow muted">02 &nbsp; / &nbsp; LOOKS GOOD</div><h1>Your receipt is ready.</h1><p>Here’s how it will look when it leaves the printer.</p></div><div className="preview-actions"><button className="secondary-button" onClick={() => setScreen(1)}><span>←</span> Edit details</button><button className="primary-button" onClick={() => window.print()}><span className="print-icon">▤</span> Print receipt</button></div></div>
      <div className="preview-stage"><div className="stage-caption"><span>LIVE PREVIEW</span><span>80 MM THERMAL</span></div>
        <article className="receipt-paper">
          <div className="receipt-brand">{receipt.business || 'Your Business'}</div>
          {receipt.address && <div className="receipt-address">{receipt.address}</div>}
          {receipt.phone && <div className="receipt-meta">Mob: {receipt.phone}</div>}{receipt.gstin && <div className="receipt-meta">GSTIN: {receipt.gstin}</div>}
          <div className="receipt-rule" />
          {receipt.customer && <div className="customer-line">Name: {receipt.customer}{receipt.customerPhone && ` (M: ${receipt.customerPhone})`}</div>}
          <div className="receipt-info"><span>Date: {displayDate}</span><b>{receipt.orderType}{receipt.table && `: ${receipt.table}`}</b></div><div className="receipt-info"><span>{time}</span></div>
          <div className="receipt-info"><span>Cashier: {receipt.cashier || '—'}</span><span>Bill No.: {receipt.number || '—'}</span></div><div className="receipt-rule" />
          <div className="receipt-columns"><span>Item</span><span>Qty.</span><span>Price</span><span>Amount</span></div><div className="receipt-rule" />
          {receipt.items.map((item, index) => <div className="receipt-item" key={index}><span>{item.name || 'Item'}</span><span>{item.qty || 0}</span><span>{money(item.price)}</span><span>{money((Number(item.qty) || 0) * (Number(item.price) || 0))}</span></div>)}
          <div className="receipt-rule" /><div className="receipt-totals"><div><span>Total Qty: {totals.qty}</span><span>Sub Total</span><b>{money(totals.subtotal)}</b></div>{Number(receipt.sgstRate) !== 0 && <div><span>SGST {receipt.sgstRate}%</span><span>{money(totals.sgst)}</span></div>}{Number(receipt.cgstRate) !== 0 && <div><span>CGST {receipt.cgstRate}%</span><span>{money(totals.cgst)}</span></div>}</div>
          <div className="receipt-rule" /><div className="rounding"><span>Round off</span><span>{Number(receipt.roundOff) >= 0 ? '+' : ''}{money(receipt.roundOff)}</span></div><div className="grand-total"><span>Grand Total</span><span>₹ {money(totals.total)}</span></div>
          <div className="receipt-rule strong" />{receipt.fssai && <div className="receipt-footer">FSSAI Lic No. {receipt.fssai}</div>}<div className="receipt-thanks">!! Thanks for visiting !!</div>
        </article><div className="stage-shadow" />
      </div><div className="preview-foot"><span>✦ &nbsp; READY WHEN YOU ARE</span><span>Use your browser’s print dialog to choose a printer.</span></div>
    </main>}
    <footer className="site-footer"><span>RECEIPT STUDIO</span><span>GOOD SERVICE. GOOD PAPERWORK.</span><span>© 2026</span></footer>
  </>;
}

function Field({ label, required, wide, children }) { return <label className={`field${wide ? ' span-2' : ''}`}><span>{label}{required && <> <b>*</b></>}</span>{children}</label>; }
function SectionTitle({ icon, title, subtitle }) { return <div className="section-title"><span className="section-icon">{icon}</span><div><h3>{title}</h3><p>{subtitle}</p></div></div>; }

createRoot(document.getElementById('root')).render(<App />);
