package com.h5.child.repository;

import com.h5.child.entity.ChildUserEntity;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface ChildUserRepository extends JpaRepository<ChildUserEntity, Integer> {
    Optional<List<ChildUserEntity>> findByConsultantUserEntity_IdAndDeleteDttmIsNull(Integer consultantUserEntityId);

    Optional<ChildUserEntity> findByIdAndConsultantUserEntity_IdAndDeleteDttmIsNull(int childUserId, int consultantId);

    Optional<List<ChildUserEntity>> findByParentUserEntity_IdAndDeleteDttmIsNull(Integer parentUserEntityId);

    @Modifying
    @Query("UPDATE ChildUserEntity c SET c.deleteDttm = :deleteDttm WHERE c.id IN :ids")
    void updateDeleteDttmForChildUsers(@Param("ids") Set<Integer> ids, @Param("deleteDttm") String deleteDttm);

    Optional<ChildUserEntity> findNameByIdAndDeleteDttmIsNull(Integer childUserId);

    Optional<List<ChildUserEntity>> findAllByParentUserEntity_IdAndDeleteDttmIsNull(Integer parentUserId);

    Optional<List<ChildUserEntity>> findALlByNameContainingAndDeleteDttmIsNull(@NotNull String name);
}
