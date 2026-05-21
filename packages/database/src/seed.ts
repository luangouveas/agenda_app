import { prisma } from './index'
import { hash } from 'bcryptjs'

async function main() {
    const company = await prisma.company.upsert({
        where: { name: 'Empresa Teste 01' },
        update: {},
        create: {
            name: 'Empresa Teste 01',
        }
    })

    console.log(`✅ Empresa "${company.name}" criada`)

    const owner = await prisma.user.upsert({
        where: { phone: '21968243286' },
        update: {},
        create: {
            name: 'Luan Gouveas',
            email: 'luan@teste.com',
            phone: '21968243286',
            passwordHash: await hash('123456', 12),
        },
    })

    await prisma.userCompanyRole.upsert({
        where: { userId_companyId: { userId: owner.id, companyId: company.id } },
        update: {},
        create: { userId: owner.id, companyId: company.id, role: 'OWNER' },
    })

    console.log(`✅ Proprietário "${owner.name}" criado (email: ${owner.email}, senha: 123456)`)

    const cliente = await prisma.user.upsert({
        where: { phone: '21999999999' },
        update: {},
        create: {
            name: 'Cliente 01',
            phone: '21999999999',
            passwordHash: await hash('cliente123', 12),
        },
    })

    console.log(`✅ Cliente "${cliente.name}" criado (phone: ${cliente.phone}, senha: cliente123)`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })