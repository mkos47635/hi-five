package com.h5.file.service;

import com.h5.file.dto.response.GetFileUrlResponseDto;
import com.h5.file.entity.FileEntity;
import com.h5.file.repository.FileRepository;
import com.h5.global.exception.FileNotFoundException;
import com.h5.global.exception.FileUploadIOException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class FileServiceImpl implements FileService {

    private final FileRepository fileRepository;

    @Value("${file.upload.root-dir}")
    private String fileUploadRootDir;

    @Value("${file.access.url.prefix}")
    private String fileAccessUrlPrefix;

    @PersistenceContext
    private EntityManager entityManager;

    public FileServiceImpl(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    @Override
    public List<FileEntity> upload(List<MultipartFile> multipartFiles, List<FileEntity.TblType> tblTypes, List<Integer> tblIds) {
        List<FileEntity> fileEntities = new ArrayList<>();
        for (int i = 0; i < multipartFiles.size(); i++) {
            FileEntity fileEntity = saveFile(multipartFiles.get(i), tblTypes.get(i), tblIds.get(i));
            fileEntities.add(fileEntity);
        }

        return fileEntities;
    }

    @Transactional
    @Override
    public List<GetFileUrlResponseDto> getFileUrl(FileEntity.TblType tblType, int tblId) {
        Session session = entityManager.unwrap(Session.class);
        session.enableFilter("activeFilter");

        List<FileEntity> fileEntities = fileRepository.findAllByTblTypeAndTblId(tblType, tblId);

        String normalizedPrefix = fileAccessUrlPrefix.endsWith("/")
                ? fileAccessUrlPrefix.substring(0, fileAccessUrlPrefix.length() - 1)
                : fileAccessUrlPrefix;

        List<GetFileUrlResponseDto> responseDtos = new ArrayList<>();
        for (FileEntity fileEntity : fileEntities) {
            String filePath = fileEntity.getFilePath().replace("\\", "/");
            if (filePath.startsWith("/")) {
                filePath = filePath.substring(1);
            }

            String url = normalizedPrefix + "/" + filePath;

            responseDtos.add(GetFileUrlResponseDto.builder()
                    .fileId(fileEntity.getId())
                    .url(url)
                    .fileName(fileEntity.getOriginFileName())
                    .build());
        }
        return responseDtos;
    }


    @Override
    public Resource downloadFile(Integer fileId) {
        Session session = entityManager.unwrap(Session.class);
        session.enableFilter("activeFilter");

        FileEntity fileEntity = fileRepository.findById(fileId)
                .orElseThrow(() -> new FileNotFoundException("File not found: " + fileId));

        return loadFileAsResource(fileEntity.getFilePath());
    }

    @Override
    public String getOriginFileName(Integer fileId) {
        Session session = entityManager.unwrap(Session.class);
        session.enableFilter("activeFilter");

        return fileRepository.findById(fileId)
                .orElseThrow(() -> new FileNotFoundException("File not found: " + fileId))
                .getOriginFileName();
    }

    @Override
    public void deleteFile(Integer fileId) {
        Session session = entityManager.unwrap(Session.class);
        session.enableFilter("activeFilter");

        FileEntity fileEntity = fileRepository.findById(fileId)
                .orElseThrow(() -> new FileNotFoundException("File not found: " + fileId));

        fileEntity.setDeleteDttm(LocalDateTime.now().toString());

        fileRepository.save(fileEntity);
    }

    private FileEntity saveFile(MultipartFile file, FileEntity.TblType tblType, int tblId) {
        String originalFileName = file.getOriginalFilename();

        String uniqueFileName = UUID.randomUUID().toString().replaceAll("-", "") + "_" + originalFileName;

        Path uploadRoot = Paths.get(fileUploadRootDir);
        Path subDir = uploadRoot.resolve(Paths.get(tblType.name(), String.valueOf(tblId)));
        Path targetPath = subDir.resolve(uniqueFileName);

        try {
            Files.createDirectories(subDir);
            file.transferTo(targetPath);
        } catch (IOException e) {
            throw new FileUploadIOException("Failed to save file: " + originalFileName, e);
        }

        return fileRepository.save(FileEntity.builder()
                .filePath(Paths.get(tblType.name(), String.valueOf(tblId), uniqueFileName).toString())
                .originFileName(originalFileName)
                .tblType(tblType)
                .tblId(tblId)
                .uploadDttm(LocalDateTime.now().toString())
                .build());
    }


    private Resource loadFileAsResource(String filePath) {
        try {
            Path fileStorageLocation = Paths.get(fileUploadRootDir).toAbsolutePath().normalize();

            Path targetPath = fileStorageLocation.resolve(filePath).normalize();

            if (!targetPath.startsWith(fileStorageLocation)) {
                throw new FileNotFoundException("File path is outside the allowed directory: " + filePath);
            }

            Resource resource = new UrlResource(targetPath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new FileNotFoundException("File not found or not readable: " + filePath);
            }

            return resource;
        } catch (MalformedURLException e) {
            throw new RuntimeException("Failed to load file as resource", e);
        }
    }

}
