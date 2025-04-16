package com.h5.deleterequest.repository;

import com.h5.deleterequest.entity.DeleteUserRequestEntity;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeleteUserRequestRepository extends JpaRepository<DeleteUserRequestEntity, Integer> {
    List<DeleteUserRequestEntity> findALlByStatusAndConsultantUser_Email(DeleteUserRequestEntity.@NotNull Status status, @Size(max = 30) @NotNull String consultantUser_email);

    Optional<DeleteUserRequestEntity> findByParentUser_IdAndStatus(Integer parentUserId, DeleteUserRequestEntity.@NotNull Status status);
}
