import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopNavComponent } from './top-nav/top-nav.component';
import { PageHeadingComponent } from './page-heading/page-heading.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TopNavComponent, PageHeadingComponent, FooterComponent],
  exports:[TopNavComponent, PageHeadingComponent, FooterComponent]
})
export class MasterModule { }
