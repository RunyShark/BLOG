import { date } from '@common/adapter';
import { UserEntity } from '@domain/entities';
import { CustomError } from '@domain/errors/custom.error';

export class AuthMapper {
  static toEntity(blogDto: Record<string, any>): UserEntity {
    const { id, email, password, accountActive, profile, blog } = blogDto;

    if (!profile) throw CustomError.internal('Error creating account');

    const { firstName, lastName } = profile;

    if (
      [!id, !email, !firstName, !lastName, !password, !!accountActive].includes(
        true
      )
    )
      throw CustomError.internal('Error creating account');

    return new UserEntity(
      id,
      email,
      password,
      accountActive,
      profile,
      blog.map((b: Record<string, any>) => ({
        ...b,
        dateOfPublication: date.DMY(b.createdAt),
      }))
    );
  }
}
