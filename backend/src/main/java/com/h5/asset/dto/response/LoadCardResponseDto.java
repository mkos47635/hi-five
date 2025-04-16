package com.h5.asset.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoadCardResponseDto {
    List<CardAssetResponseDto> cardAssetList;
}
