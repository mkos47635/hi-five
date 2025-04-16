package com.h5.parent.entity;

import com.h5.child.entity.ChildUserEntity;
import com.h5.consultant.entity.ConsultantUserEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "parent_user")
public class ParentUserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "parent_user_id", nullable = false)
    private Integer id;

    @Size(max = 10)
    @NotNull
    @Column(name = "name", nullable = false, length = 10)
    private String name;

    @Size(max = 30)
    @NotNull
    @Column(name = "email", nullable = false, length = 30)
    private String email;

    @Size(max = 75)
    @NotNull
    @Column(name = "pwd", nullable = false, length = 75)
    private String pwd;

    @Size(max = 13)
    @NotNull
    @Column(name = "phone", nullable = false, length = 13)
    private String phone;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "create_dttm")
    private String createDttm;

    @Column(name = "delete_dttm")
    private String deleteDttm;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "update_dttm", insertable = false, updatable = false)
    private String updateDttm;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "consultant_user_id", nullable = false)
    private ConsultantUserEntity consultantUserEntity;

    @OneToMany(mappedBy = "parentUserEntity")
    private Set<ChildUserEntity> childUserEntities = new LinkedHashSet<>();

    @Column(name = "temp_pwd")
    private boolean tempPwd;

}
