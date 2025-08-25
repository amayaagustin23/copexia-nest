import { Injectable, NotFoundException } from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';
import { paginatePrisma, PaginationResult } from 'src/common/pagination';
import { PaginationArgs } from 'src/common/pagination/pagination.interface';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { CreatePostDto, PostStatusDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        ...data,
        status: (data.status ?? PostStatusDto.DRAFT) as any,
        publishedAt:
          data.status === PostStatusDto.PUBLISHED ? new Date() : null,
      },
    });
  }

  findAllPublic(params?: { categorySlug?: string }) {
    const { categorySlug } = params || {};
    return this.prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        ...(categorySlug && { category: { slug: categorySlug } }),
      },
      orderBy: { publishedAt: 'desc' },
      include: { category: true },
    });
  }

  findBySlugPublic(slug: string) {
    return this.prisma.post.findFirst({
      where: { slug, status: 'PUBLISHED' },
      include: { category: true },
    });
  }

  async findAll(pagination: PaginationArgs): Promise<PaginationResult<Post>> {
    console.log('entra');
    const { search } = pagination;

    const where: Prisma.PostWhereInput = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { slug: { contains: search, mode: 'insensitive' } },
          { excerpt: { contains: search, mode: 'insensitive' } },
          { category: { name: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    };

    const prismaArgs: Prisma.PostFindManyArgs = {
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    };

    const result = await paginatePrisma(
      this.prisma.post,
      prismaArgs,
      pagination,
    );
    console.log('result', result);
    return result;
  }

  async findOne(id: string) {
    try {
      return await this.prisma.post.findUnique({ where: { id } });
    } catch {
      throw new NotFoundException('Post not found');
    }
  }

  async update(id: string, data: UpdatePostDto) {
    try {
      return await this.prisma.post.update({
        where: { id },
        data: {
          ...data,
          ...(data.status && {
            publishedAt:
              data.status === PostStatusDto.PUBLISHED ? new Date() : null,
          }),
        },
      });
    } catch {
      throw new NotFoundException('Post not found');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.post.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Post not found');
    }
  }
}
