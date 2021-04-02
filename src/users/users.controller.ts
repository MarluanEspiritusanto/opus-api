import { AuthService } from "./../auth/auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { JwtAuthGuard } from "./../auth/guards/jwt-auth.guard";
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { QueryParams } from "../../framework/utils/query";
import { ApiTags, ApiHeader } from "@nestjs/swagger";


@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiHeader({
    name: "Authorization",
    description: "Bearer token authorization for access endpoint"
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() params: QueryParams) {
    return this.usersService.findAll(params);
  }

  @ApiHeader({
    name: "Authorization",
    description: "Bearer token authorization for access endpoint"
  })
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(+id);
  }

  @ApiHeader({
    name: "Authorization",
    description: "Bearer token authorization for access endpoint"
  })
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiHeader({
    name: "Authorization",
    description: "Bearer token authorization for access endpoint"
  })
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }

  @Post("login")
  async login(@Body() loginUserDto: LoginUserDto) {
    const getUser = await this.usersService.findByEmail(loginUserDto.email);
    if (getUser && getUser.password === loginUserDto.password) {
      const { password, ...result } = getUser;
      const authDto = {
        email: result.email,
        userId: result.id,
      };
      const token = await this.authService.login(authDto);
      return {
        user: result,
        ...token,
      };
    }
    return null;
  }
}
