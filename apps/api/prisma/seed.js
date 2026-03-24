"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACCOUNT_IDS = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// ── System Chart of Accounts ────────────────────────────────────────
// MUST use these stable IDs — referenced in lib/ledger.ts
const SYSTEM_ACCOUNTS = [
    { id: 'acc-1010', code: '1010', name: 'Cash on Hand', type: 'ASSET', isSystem: true },
    { id: 'acc-1200', code: '1200', name: 'Accounts Receivable', type: 'ASSET', isSystem: true },
    { id: 'acc-1500', code: '1500', name: 'Inventory Valuation', type: 'ASSET', isSystem: true },
    { id: 'acc-2000', code: '2000', name: 'Accounts Payable', type: 'LIABILITY', isSystem: true },
    { id: 'acc-3000', code: '3000', name: 'Retained Earnings', type: 'EQUITY', isSystem: true },
    { id: 'acc-4000', code: '4000', name: 'Sales Revenue', type: 'REVENUE', isSystem: true },
    { id: 'acc-5000', code: '5000', name: 'Cost of Goods Sold', type: 'EXPENSE', isSystem: true },
    { id: 'acc-5100', code: '5100', name: 'Shrinkage & Transit Loss', type: 'EXPENSE', isSystem: true },
    { id: 'acc-5200', code: '5200', name: 'Payroll Expense', type: 'EXPENSE', isSystem: true },
    { id: 'acc-5300', code: '5300', name: 'General Expenses', type: 'EXPENSE', isSystem: true },
];
// ── Export stable account IDs for use in ledger.ts ──────────────────
exports.ACCOUNT_IDS = Object.fromEntries(SYSTEM_ACCOUNTS.map(a => [a.code, a.id]));
async function main() {
    console.log('🌱 Seeding BRAYN Hybrid Edition database...');
    // ── Upsert system accounts ──────────────────────────────────────
    for (const acct of SYSTEM_ACCOUNTS) {
        await prisma.account.upsert({
            where: { id: acct.id },
            create: acct,
            update: {},
        });
        console.log(`  ✓ Account ${acct.code}: ${acct.name}`);
    }
    // ── Seed default channel (Main Warehouse) ───────────────────────
    const defaultChannel = await prisma.channel.upsert({
        where: { code: 'HQ' },
        create: {
            name: 'Headquarters',
            code: 'HQ',
            type: 'WAREHOUSE',
            isMainWarehouse: true,
        },
        update: {},
    });
    console.log(`  ✓ Channel: ${defaultChannel.name} (${defaultChannel.code})`);
    // ── Seed super admin user ───────────────────────────────────────
    // Password: Admin@123 (hashed with argon2 — replace in production)
    const adminUser = await prisma.user.upsert({
        where: { id: 'usr-super-admin' },
        create: {
            id: 'usr-super-admin',
            username: 'admin',
            email: 'admin@brayn.app',
            passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$placeholder_hash_replace_on_first_login',
            role: 'SUPER_ADMIN',
            channelId: defaultChannel.id,
        },
        update: {},
    });
    console.log(`  ✓ Admin user: ${adminUser.username} (${adminUser.email})`);
    // ── Seed document template for receipts ─────────────────────────
    await prisma.documentTemplate.upsert({
        where: { id: 'tpl-receipt-default' },
        create: {
            id: 'tpl-receipt-default',
            name: 'Default Receipt',
            type: 'receipt',
            content: JSON.stringify({
                header: '{{channelName}}',
                showLogo: true,
                showAddress: true,
                footer: 'Thank you for shopping with us!',
                paperSize: '80mm',
            }),
        },
        update: {},
    });
    console.log('  ✓ Default receipt template');
    console.log('\n✅ Seed complete!');
}
main()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map