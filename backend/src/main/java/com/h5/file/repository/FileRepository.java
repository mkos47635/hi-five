package com.h5.file.repository;

import com.h5.file.entity.FileEntity;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<FileEntity, Integer> {
    List<FileEntity> findAllByTblTypeAndTblId(FileEntity.@NotNull TblType tblType, @NotNull Integer tblId);
}
