import {
  MatButtonModule, MatCheckboxModule, MatSidenavModule, MatAutocompleteModule,
  MatFormFieldModule, MatInputModule, MatIcon, MatIconModule
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
    MatIconModule,
  ],
  exports: [
    MatFormFieldModule,
    MatSidenavModule,
    MatButtonModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
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
