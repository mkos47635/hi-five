package com.h5.asset.controller;

import com.h5.asset.dto.request.LoadAssetByStageDto;
import com.h5.asset.dto.request.LoadAssetRequestDto;
import com.h5.asset.dto.request.LoadCardRequestDto;
import com.h5.asset.dto.request.LoadStudyAssetRequestDto;
import com.h5.asset.service.AssetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/asset")
@RequiredArgsConstructor
public class AssetController {
    private final AssetService assetService;

    @GetMapping("/load-asset")
    public ResponseEntity<?> getAsset(@ModelAttribute LoadAssetRequestDto loadAssetRequestDto) {
        return ResponseEntity.ok(assetService.loadAsset(loadAssetRequestDto));
    }

    @GetMapping("/load-cards")
    public ResponseEntity<?> getCards(@ModelAttribute LoadCardRequestDto loadCardRequestDto) {
        return ResponseEntity.ok(assetService.loadCards(loadCardRequestDto));
    }

    @GetMapping("/load-stage-asset")
    public ResponseEntity<?> getAssetByStage(@ModelAttribute LoadAssetByStageDto loadAssetByStageDto) {
        return ResponseEntity.ok(assetService.loadAssetByStage(loadAssetByStageDto));
    }

    @GetMapping("/load-chapter-asset")
    public ResponseEntity<?> getChapterAsset(@ModelAttribute LoadAssetRequestDto loadAssetRequestDto) {
        return ResponseEntity.ok(assetService.loadChapterAsset(loadAssetRequestDto));
    }

    @GetMapping("/load-study-asset")
    public ResponseEntity<?> getStudyAsset(@ModelAttribute LoadStudyAssetRequestDto loadStudyAssetRequestDto){
        return ResponseEntity.ok(assetService.loadStudyAsset(loadStudyAssetRequestDto));
    }

    @GetMapping("/get-stage/{childId}")
    public ResponseEntity<?> getStage(@PathVariable int childId) {
        return ResponseEntity.ok(assetService.getStage(childId));
    }
}
