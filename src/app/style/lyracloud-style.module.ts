import {
  MatButtonModule, MatCheckboxModule, MatSidenavModule, MatAutocompleteModule,
  MatFormFieldModule, MatInputModule
} from '@angular/material'
import {NgModule} from "@angular/core";
import {OVERLAY_PROVIDERS, OverlayContainer} from "@angular/cdk/overlay";

@NgModule({
  imports: [
    MatFormFieldModule,
    MatSidenavModule,
    MatButtonModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatInputModule,
  ],
  exports: [
    MatFormFieldModule,
    MatSidenavModule,
    MatButtonModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatInputModule,
  ],
  providers: [
    OVERLAY_PROVIDERS
  ]
})
export class LyracloudStyleModule {
  constructor(private overlayContainer: OverlayContainer) {
    overlayContainer.getContainerElement().classList.add('lyracloud-dark-theme')
  }
}
