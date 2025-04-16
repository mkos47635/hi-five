package com.h5.consultant.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "consultant_user")
public class ConsultantUserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "consultant_user_id", nullable = false)
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

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "create_dttm", nullable = false)
    private String createDttm;

    @Column(name = "delete_dttm")
    private String deleteDttm;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "update_dttm")
    private String updateDttm;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "center_id", nullable = false)
    private Center center;

    @Size(max = 45)
    @Column(name = "temp_pwd", length = 45)
    private boolean tempPwd;

}