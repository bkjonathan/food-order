import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
    // rs.initiate({
    //   _id: 'rs0',
    //   version: 1,
    //   members: [
    //     { _id: 0, host: 'mongo-primary:27018' },
    //     { _id: 1, host: 'mongo-secondary:27019' },
    //     { _id: 3, host: 'mongo-arbiter:27020' }
    //   ]
    // })
    //
    // db.createUser({
    //   user: "thomas",
    //   pwd: "thomas1234",
    //   roles: [{ role: "userAdminAnyDatabase", db: "admin" }]
    // })
  }
}
