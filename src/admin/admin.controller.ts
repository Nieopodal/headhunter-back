import {Controller, Get, Param} from '@nestjs/common';
import {AdminService} from "./admin.service";
import {Admin} from "./entity/admin.entity";

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {
    }
    @Get(':id')
    async getUserById(@Param('id') id: string): Promise<Admin> {
        return await this.adminService.getUserById(id);
    }
}

