package com.h5.notice.entity;

import com.h5.consultant.entity.ConsultantUserEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notice")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NoticeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notice_id", nullable = false)
    private Integer id;

    @Size(max = 200)
    @NotNull
    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @NotNull
    @Builder.Default
    @Column(name = "view_cnt", nullable = false)
    private Integer viewCnt = 0;

    @NotNull
    @Lob
    @Column(name = "content", nullable = false)
    private String content;

    @NotNull
    @Column(name = "create_dttm", nullable = false, updatable = false)
    private LocalDateTime createDttm;

    @NotNull
    @Column(name = "update_dttm", nullable = false)
    private LocalDateTime updateDttm;

    @Column(name = "delete_dttm")
    private LocalDateTime deleteDttm;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "consultant_user_id", nullable = false)
    private ConsultantUserEntity consultantUser;

    @PrePersist
    protected void onCreate() {
        this.createDttm = LocalDateTime.now();
        this.updateDttm = LocalDateTime.now();
        if (this.viewCnt == null) {
            this.viewCnt = 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updateDttm = LocalDateTime.now();
    }
}
