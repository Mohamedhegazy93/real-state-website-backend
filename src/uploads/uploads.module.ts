import { BadRequestException, Module } from "@nestjs/common";
import { UploadsController } from "./uploads.controller";
import { MulterModule } from "@nestjs/platform-express";
// import { diskStorage } from "multer"; // ❌ قم بإزالة هذا الاستيراد
import { memoryStorage } from "multer"; // ✅ استورد memoryStorage بدلاً منه

@Module({
    controllers: [UploadsController],
    imports: [
        MulterModule.register(
            {
                storage: memoryStorage(), // ✅ استخدم memoryStorage() هنا بدلاً من diskStorage
                fileFilter: (req, file, cb) => {
                    if (file.mimetype.startsWith('image') || file.mimetype.startsWith('video')) {
                        cb(null, true);
                    } else {
                        cb(new BadRequestException('unsupported file format'), false);
                    }
                },
                limits: {
                    fileSize: 200 * 1024 * 1024
                }
            }
        )
    ]
})
export class UploadsModule { }