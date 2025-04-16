package com.h5.qna.entity;

import com.h5.parent.entity.ParentUserEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "qna")
public class QnaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "qna_id", nullable = false)
    private Integer id;

    @Size(max = 200)
    @NotNull
    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @NotNull
    @Lob
    @Column(name = "content", nullable = false)
    private String content;

    @NotNull
    @Column(name = "create_dttm", nullable = false)
    private LocalDateTime createDttm;

    @NotNull
    @Column(name = "update_dttm", nullable = false)
    private LocalDateTime updateDttm;

    @Column(name = "delete_dttm")
    private LocalDateTime deleteDttm;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "parent_user_id", nullable = false)
    private ParentUserEntity parentUser;

    @PrePersist
    protected void onCreate() {
        this.createDttm = LocalDateTime.now();
        this.updateDttm = LocalDateTime.now();

    }

    @PreUpdate
    protected void onUpdate() {
        this.updateDttm = LocalDateTime.now();
    }
}
