package com.h5.consultant.repository;

import com.h5.consultant.entity.ConsultantUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConsultantUserRepository extends JpaRepository<ConsultantUserEntity, Integer> {
    Optional<ConsultantUserEntity> findByEmail(String email);

    Optional<ConsultantUserEntity> findEmailByNameAndPhone(String name, String phone);

    boolean existsByEmail(String email);

    Optional<ConsultantUserEntity> findByEmailAndDeleteDttmIsNull(String email);
}
