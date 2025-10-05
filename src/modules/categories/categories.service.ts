import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { paginatePrisma } from '../../common/pagination';
import { PaginationArgs } from '../../common/pagination/pagination.interface';
import { PrismaService } from '../../services/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    // Verificar que el slug no existe
    const existingCategory = await this.prisma.category.findUnique({
      where: { slug: createCategoryDto.slug },
    });

    if (existingCategory) {
      throw new BadRequestException('Ya existe una categoría con este slug');
    }

    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async findAllAdmin(pagination: PaginationArgs) {
    const where: any = {
      ...(pagination.search && {
        OR: [
          { name: { contains: pagination.search, mode: 'insensitive' } },
          { description: { contains: pagination.search, mode: 'insensitive' } },
          { slug: { contains: pagination.search, mode: 'insensitive' } },
        ],
      }),
      ...(pagination.startDate &&
        pagination.endDate && {
          createdAt: {
            gte: pagination.startDate,
            lte: pagination.endDate,
          },
        }),
    };

    const orderBy: any =
      pagination.orderBy === 'updatedAt'
        ? [{ sortOrder: 'asc' }, { updatedAt: 'desc' }]
        : [{ sortOrder: 'asc' }, { name: 'asc' }];

    const result = await paginatePrisma(
      this.prisma.category,
      {
        where,
        include: {
          posts: {
            include: {
              post: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  status: true,
                  publishedAt: true,
                },
              },
            },
          },
        },
        orderBy,
      },
      pagination,
    );
    const categoriesWithPostCount = result.data.map((category: any) => ({
      ...category,
      postCount: category.posts.length,
    }));

    // Calcular estadísticas
    const totalCategories = await this.prisma.category.count();
    const activeCategories = await this.prisma.category.count({
      where: { isActive: true },
    });
    const categoriesWithPosts = await this.prisma.category.count({
      where: {
        posts: {
          some: {},
        },
      },
    });

    const stats = {
      totalCategories,
      activeCategories,
      inactiveCategories: totalCategories - activeCategories,
      categoriesWithPosts,
      categoriesWithoutPosts: totalCategories - categoriesWithPosts,
    };

    return {
      ...result,
      data: categoriesWithPostCount,
      stats,
    };
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        posts: {
          include: {
            post: {
              select: {
                id: true,
                title: true,
                slug: true,
                status: true,
                publishedAt: true,
              },
            },
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return category;
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        posts: {
          include: {
            post: {
              select: {
                id: true,
                title: true,
                slug: true,
                status: true,
                publishedAt: true,
              },
            },
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException('Categoría no encontrada');
    }

    // Si se actualiza el slug, verificar que no existe
    if (
      updateCategoryDto.slug &&
      updateCategoryDto.slug !== existingCategory.slug
    ) {
      const slugExists = await this.prisma.category.findUnique({
        where: { slug: updateCategoryDto.slug },
      });

      if (slugExists) {
        throw new BadRequestException('Ya existe una categoría con este slug');
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        posts: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    // Verificar si tiene posts asociados
    if (category.posts.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar una categoría que tiene posts asociados',
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: 'Categoría eliminada correctamente' };
  }
}
