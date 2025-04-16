package com.h5.deleterequest.entity;

import com.h5.consultant.entity.ConsultantUserEntity;
import com.h5.parent.entity.ParentUserEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor
@Builder
@Table(name = "delete_user_request")
public class DeleteUserRequestEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "delete_user_request_id", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "delete_request_dttm")
    private String deleteRequestDttm;

    @Column(name = "delete_confirm_dttm")
    private String deleteConfirmDttm;

    public enum Status {
        P, A, R
    }

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "parent_user_id", nullable = false)
    private ParentUserEntity parentUser;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "consultant_user_id", nullable = false)
    private ConsultantUserEntity consultantUser;

}
