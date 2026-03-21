import React, { useState } from 'react';

export default function MoodInput({ onSubmit }) {
  const [mood, setMood] = useState('');
  const chips = ['happy','sad','angry','calm','neutral'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mood.trim()) { onSubmit(mood.toLowerCase().trim()); setMood(''); }
  };

  return (
    <>
      <style>{`
        .mi-wrap{display:flex;flex-direction:column;gap:12px;}
        .mi-row{display:flex;gap:10px;}
        .mi-input{flex:1;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.09);color:#f0eeff;padding:12px 16px;border-radius:12px;font-family:'Nunito',sans-serif;font-size:0.9rem;font-weight:500;outline:none;transition:border-color 0.2s,background 0.2s;}
        .mi-input:focus{border-color:rgba(167,139,250,0.5);background:rgba(167,139,250,0.05);}
        .mi-input::placeholder{color:rgba(240,238,255,0.2);}
        .mi-btn{background:linear-gradient(135deg,#7c3aed,#ec4899);border:none;color:white;padding:12px 20px;border-radius:12px;font-family:'Nunito',sans-serif;font-size:0.85rem;font-weight:700;cursor:pointer;transition:all 0.2s;white-space:nowrap;box-shadow:0 4px 14px rgba(124,58,237,0.3);}
        .mi-btn:hover{transform:translateY(-1px) !important;box-shadow:0 8px 20px rgba(124,58,237,0.45);}
        .mi-chips{display:flex;flex-wrap:wrap;gap:7px;}
        .mi-chip{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:rgba(240,238,255,0.4);padding:5px 14px;border-radius:100px;font-size:0.78rem;font-weight:600;cursor:pointer;font-family:'Nunito',sans-serif;transition:all 0.15s;letter-spacing:0.02em;}
        .mi-chip:hover{background:rgba(167,139,250,0.12);border-color:rgba(167,139,250,0.3);color:#c4b5fd;transform:none !important;}
      `}</style>
      <form className="mi-wrap" onSubmit={handleSubmit}>
        <div className="mi-row">
          <input className="mi-input" type="text" placeholder="e.g. happy, sad, calm..." value={mood} onChange={e=>setMood(e.target.value)} />
          <button className="mi-btn" type="submit">Find music</button>
        </div>
        <div className="mi-chips">
          {chips.map(c => <button key={c} type="button" className="mi-chip" onClick={()=>onSubmit(c)}>{c}</button>)}
        </div>
      </form>
    </>
  );
}