const fs = require('fs');

function replaceDesaToRW(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace Indonesian
  content = content.replace(/Sistem Keuangan Desa/g, 'Sistem Keuangan RW');
  content = content.replace(/Sistem Informasi Keuangan Desa/g, 'Sistem Informasi Keuangan RW');
  content = content.replace(/AI Desa/g, 'AI RW');
  content = content.replace(/kas desa/g, 'kas RW');
  content = content.replace(/Agenda Desa/g, 'Agenda RW');
  content = content.replace(/belanja desa/g, 'belanja RW');
  content = content.replace(/Aset Desa/g, 'Aset RW');
  content = content.replace(/aset tetap desa/g, 'aset tetap RW');
  content = content.replace(/transaksi desa/g, 'transaksi RW');
  content = content.replace(/entitas desa/g, 'entitas RW');
  content = content.replace(/Digital Village/g, 'Digital RW');
  content = content.replace(/APBDesa/g, 'APBRW');
  content = content.replace(/APBDes/g, 'APBRW');
  content = content.replace(/colVillage: "Desa"/g, 'colVillage: "RW"');
  content = content.replace(/Kepala Desa/g, 'Ketua RW');
  content = content.replace(/Pemdes/g, 'Pengurus RW');
  content = content.replace(/Kades/g, 'Ketua RW');
  
  // Specific single words mapping carefully
  content = content.replace(/Warga Desa/g, 'Warga RW');
  content = content.replace(/desa secara/g, 'RW secara');
  content = content.replace(/Desa"/g, 'RW"');

  // Replace English
  content = content.replace(/Village Financial System/g, 'RW Financial System');
  content = content.replace(/Village AI/g, 'RW AI');
  content = content.replace(/Village Agenda/g, 'RW Agenda');
  content = content.replace(/Village Asset/g, 'RW Asset');
  content = content.replace(/village budgets/g, 'RW budgets');
  content = content.replace(/village transactions/g, 'RW transactions');
  content = content.replace(/village entities/g, 'RW entities');
  
  // Careful replacements
  content = content.replace(/colVillage: "Village"/g, 'colVillage: "RW"');
  
  fs.writeFileSync(filePath, content);
}

replaceDesaToRW('src/lib/i18n.ts');
replaceDesaToRW('src/app/layout.tsx');
replaceDesaToRW('src/server/actions/ai-gemini.ts');
replaceDesaToRW('src/server/actions/ai-insights.ts');
replaceDesaToRW('src/server/actions/auth-reset.ts');
replaceDesaToRW('src/components/dashboard/SoftBreakdown.tsx');
replaceDesaToRW('src/components/layout/Sidebar.tsx');
replaceDesaToRW('src/components/layout/TopBarProfile.tsx');
replaceDesaToRW('src/app/login/page.tsx');

console.log('Replacement done.');
