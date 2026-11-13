import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IUser, UserRole } from '../../common/interface/user.interface';
import { MongooseModule } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<IUser>;

@Schema()
export class User {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ type: String, required: false })
  phone: string;

  @Prop({ type: Boolean, default: false })
  isConfirmed: boolean;

  @Prop({ type: String, required: false })
  image: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop({ type: Date })
  deletedAt: Date;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date })
  restoredAt: Date;
}

export const userSchema = SchemaFactory.createForClass(User);

export const UserModel = MongooseModule.forFeature([
  { name: User.name, schema: userSchema },
]);
