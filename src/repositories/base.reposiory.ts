import { Model, Types, UpdateQuery,Document } from "mongoose";

export class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) { }

  findAll() {
    return this.model.find().exec();
  }

  findById(id: string | Types.ObjectId) {
    return this.model.findById(id).exec();
  }
  async create(data: Partial<T>): Promise<T> {
    const doc = new this.model(data);
    await doc.save();
    return doc;
  }

  update(id: string | Types.ObjectId, data: UpdateQuery<T>) {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  delete(id: string | Types.ObjectId) {
    return this.model.findByIdAndDelete(id).exec();
  }
}