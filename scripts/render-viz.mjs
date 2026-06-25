// 业务分析体检 · 可视化改前→改后(baoyu-design craft · 价值口径"过老板 so what")
// 用法:node scripts/render-viz.mjs <data.json> <out.png>
import { chromium } from '/Users/vera/.claude/skills/guizang-social-card-skill/node_modules/playwright/index.mjs';
import { readFileSync } from 'fs';
const [,, dataPath, outPath] = process.argv;
const d = JSON.parse(readFileSync(dataPath, 'utf8'));
const ava = (()=>{ try { return 'data:image/png;base64,'+readFileSync(new URL('../assets/avatar.png', import.meta.url)).toString('base64'); } catch { return ''; } })();
const W=1120, H=1150;
const cities = d.cities;
const maxSales = Math.max(...cities.map(c=>c.sales));

// ---- 改前:精致柱状(viewBox 460x340)----
const barW=70, gap=58, bx0=70, baseY=270;
const bars = cities.map((c,i)=>{ const h=c.sales/maxSales*180; const x=bx0+i*(barW+gap);
  return `
  <rect x="${x}" y="${baseY-h}" width="${barW}" height="${h}" rx="9" fill="${i===0?'#caa97f':'#cfc7b8'}"/>
  <text x="${x+barW/2}" y="${baseY-h-14}" text-anchor="middle" font-size="20" font-weight="800" fill="${i===0?'#B0502C':'#7a7268'}">${c.sales}</text>
  <text x="${x+barW/2}" y="${baseY+34}" text-anchor="middle" font-size="22" font-weight="700" fill="#574f45">${c.name}</text>`;}).join('');

// ---- 改后:机会象限散点(viewBox 460x340)----
const qx0=72, qy0=42, qw=330, qh=210;
const px = r => qx0 + r*qw;            // 销潜比 0..1 (左低=机会)
const py = g => qy0+qh - (g/25)*qh;    // 增长 0..25
const dots = cities.map(c=>{ const x=px(c.ratio), y=py(c.gr); const big=c.opp; const rr=big?20:13;
  return `${big?`<circle cx="${x}" cy="${y}" r="34" fill="#7E9B5B" opacity="0.18"/>`:''}
  <circle cx="${x}" cy="${y}" r="${rr}" fill="${big?'#6E9152':'#c4baa8'}" stroke="${big?'#fff':'none'}" stroke-width="${big?3:0}"/>
  <text x="${x}" y="${y-rr-9}" text-anchor="middle" font-size="${big?22:18}" font-weight="800" fill="${big?'#3F6B53':'#857c70'}">${c.name}</text>
  ${big?`<text x="${x}" y="${y+5}" text-anchor="middle" font-size="18" fill="#fff" font-weight="800">★</text>`:''}`;}).join('');

const html=`<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box;font-family:'PingFang SC','Hiragino Sans GB',sans-serif}
body{width:${W}px;height:${H}px;background:#F5F0E6;position:relative;
 background-image:radial-gradient(rgba(64,59,54,.05) 1px,transparent 1px);background-size:38px 38px}
.pad{padding:56px 60px}
.kick{display:inline-flex;align-items:center;gap:13px;font-size:25px;font-weight:800;letter-spacing:.08em;color:#BE7A4C}
.kick .dot{width:13px;height:13px;border-radius:50%;background:#D4956A}
.hook{font-size:54px;font-weight:800;color:#403B36;line-height:1.18;margin-top:22px;letter-spacing:-.01em}
.hook mark{background:linear-gradient(transparent 55%,#F3E3BE 55%,#F3E3BE 92%,transparent 92%);color:inherit;padding:0 8px}
.cat{font-size:23px;font-weight:700;color:#9a8e80;margin-top:24px}
.row{display:flex;gap:40px;margin-top:36px;align-items:stretch}
.card{flex:1;position:relative;background:#FBF7EE;border:2px solid #EBE2CE;border-radius:30px;padding:34px 34px 30px;box-shadow:0 22px 55px rgba(64,59,54,.08)}
.tab{display:inline-flex;align-items:center;gap:10px;font-size:25px;font-weight:800;padding:11px 26px;border-radius:16px}
.card.bad .tab{background:#F2E3D9;color:#B0502C}.card.good .tab{background:#E3EEE4;color:#3F6B53}
.take{font-size:28px;font-weight:800;color:#403B36;margin:20px 0 4px;line-height:1.35}
.chartwrap{margin-top:10px}
.boss{display:flex;align-items:center;gap:12px;margin-top:22px;font-size:23px;font-weight:800;padding:20px 22px;border-radius:18px;position:relative;white-space:nowrap}
.card.bad .boss{background:#F6E9E1;color:#B0502C}.card.good .boss{background:#E6F0E8;color:#3F6B53}
.boss .ic{font-size:30px}
.arrow{align-self:center;font-size:48px;font-weight:800;color:#BE7A4C;flex:0 0 auto}
.qlab{font-weight:700;fill:#a99e8d}
.foot{display:flex;justify-content:space-between;align-items:center;margin-top:38px}
.foot .b{display:flex;align-items:center;gap:18px}
.foot img{width:78px;height:78px;border-radius:50%;border:4px solid #fff;box-shadow:0 8px 22px rgba(190,122,76,.28)}
.foot .nm{font-size:30px;font-weight:800;color:#403B36}.foot .se{font-size:23px;font-weight:800;color:#BE7A4C}
.foot .gh{font-size:22px;font-weight:700;color:#857c70;text-align:right;line-height:1.5}.foot .gh b{color:#BE7A4C}
</style></head><body><div class="pad">
 <div class="kick"><span class="dot"></span>业务分析体检 · 一起进化</div>
 <div class="hook">你的数据分析,<br>过得了老板那句「<mark>so what?</mark>」吗?</div>
 <div class="cat">${d.category||''}</div>

 <div class="row">
  <div class="card bad">
   <span class="tab">改前 ❌ 一堆数字</span>
   <div class="take">${d.beforeNote||'只看销量大小 →「投最大的」'}</div>
   <div class="chartwrap"><svg width="100%" height="300" viewBox="0 0 460 320">
     <text x="60" y="34" font-size="18" font-weight="700" fill="#a99e8d">季度销量(万)</text>
     <line x1="60" y1="270" x2="430" y2="270" stroke="#e0d6c4" stroke-width="2.5"/>
     ${bars}
   </svg></div>
   <div class="boss"><span class="ic">🗣</span>老板:so what?要我批啥?</div>
  </div>

  <div class="arrow">→</div>

  <div class="card good">
   <span class="tab">改后 ✅ 看出机会</span>
   <div class="take">${d.afterNote||'销潜比×增长 →「机会在哪、投哪」'}</div>
   <div class="chartwrap"><svg width="100%" height="300" viewBox="0 0 460 320">
     <rect x="${qx0}" y="${qy0}" width="${qw/2}" height="${qh/2}" fill="#7E9B5B" opacity="0.07"/>
     <line x1="${qx0}" y1="${qy0+qh/2}" x2="${qx0+qw}" y2="${qy0+qh/2}" stroke="#e4dccd" stroke-width="2" stroke-dasharray="6 6"/>
     <line x1="${qx0+qw/2}" y1="${qy0}" x2="${qx0+qw/2}" y2="${qy0+qh}" stroke="#e4dccd" stroke-width="2" stroke-dasharray="6 6"/>
     <text x="${qx0+6}" y="${qy0+18}" class="qlab" font-size="17">↑ 增长高</text>
     <text x="${qx0+qw-2}" y="${qy0+qh+26}" text-anchor="end" class="qlab" font-size="17">销潜比高 → 饱和 →</text>
     <text x="${qx0+10}" y="${qy0+qh/2-8}" class="qlab" font-size="16" fill="#7E9B5B" font-weight="800">机会象限</text>
     ${dots}
   </svg></div>
   <div class="boss"><span class="ic">🗣</span>老板:清楚,就这么投 ✅</div>
  </div>
 </div>

 <div class="foot">
  <div class="b">${ava?`<img src="${ava}">`:''}<div><div class="nm">MKTer 小V</div><div class="se">一起进化</div></div></div>
  <div class="gh">开源 Skill「业务分析体检」<br>GitHub 搜 <b>MKTerXiaoV</b></div>
 </div>
</div></body></html>`;
const br=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--no-sandbox']});
const pg=await br.newPage({viewport:{width:W,height:H},deviceScaleFactor:2});
await pg.setContent(html,{waitUntil:'load'}); await pg.waitForTimeout(300);
await pg.screenshot({path:outPath});
await br.close(); console.log('已生成:',outPath);
