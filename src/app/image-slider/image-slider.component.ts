import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Input,
  ViewChildren,
  QueryList,
  SimpleChanges,
  OnChanges,
  HostListener,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { Subject, debounceTime, fromEvent, takeUntil } from 'rxjs';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.css'],
})
export class ImageSliderComponent
  implements AfterViewInit, OnChanges, OnInit, OnDestroy
{
  @ViewChild('sliderList') sliderList!: ElementRef;
  // @ViewChildren('sliderElements') sliderElements!: QueryList<ElementRef>;
  @Input('data') data: any[] = [];

  @Input('contentType') contentType!: 'video' | 'document';
  emptyClickHandler() {}
  showLeftArrow = false;
  showRightArrow = false;
  activeTabIndex: number = 0;

  dragging = false;
  isDragging = false;
  destroyed$ = new Subject<boolean>();
  constructor(private el: ElementRef, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    fromEvent(window, 'resize')
      .pipe(takeUntil(this.destroyed$), debounceTime(200))
      .subscribe(() => {
        console.log('Window resizing');
        this.manageIcons();
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.manageIcons();
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      setTimeout(() => {
        this.manageIcons();
      }, 0);
    }
  }

  selectCard(index: number, selectedTag: HTMLLIElement): void {
    if (this.data.length === 0) {
      return;
    }
    this.activeTabIndex = index;

    if (this.sliderList && selectedTag) {
      const container = this.sliderList.nativeElement;

      const containerWidth = container.offsetWidth;
      const selectedTagWidth = selectedTag.offsetWidth;

      const selectedTagOffsetLeft = selectedTag.offsetLeft;
      const containerScrollLeft = container.scrollLeft;
      const centerOffset = (containerWidth - selectedTagWidth) / 2;

      if (selectedTagOffsetLeft - 50 < containerScrollLeft) {
        this.sliderList.nativeElement.scrollLeft =
          selectedTagOffsetLeft - centerOffset;
      } else if (
        selectedTagOffsetLeft + selectedTagWidth + 50 >
        containerScrollLeft + containerWidth
      ) {
        this.sliderList.nativeElement.scrollLeft =
          selectedTagOffsetLeft +
          selectedTagWidth -
          containerWidth +
          centerOffset;
      }
    }
  }

  scrollRight(): void {
    this.sliderList.nativeElement.scrollLeft += 200;
    this.manageIcons();
  }

  scrollLeft(): void {
    this.sliderList.nativeElement.scrollLeft -= 200;
    this.manageIcons();
  }

  manageIcons(): void {
    if (this.data.length === 0) {
      return;
    }

    const scrollLeft = this.sliderList.nativeElement.scrollLeft;
    const maxScrollValue =
      this.sliderList.nativeElement.scrollWidth -
      this.sliderList.nativeElement.clientWidth -
      20;

    if (scrollLeft >= 20) {
      this.showLeftArrow = true;
    } else {
      this.showLeftArrow = false;
    }

    if (scrollLeft >= maxScrollValue) {
      this.showRightArrow = false;
    } else {
      this.showRightArrow = true;
    }

    this.cdr.detectChanges();
  }

  // openTutorial(d: any) {
  //   if (d.YoutubeUrl) {
  //     window.open(d.YoutubeUrl, '_blank');
  //   }
  // }

  onMousemove(event: MouseEvent) {
    if (!this.dragging) return;
    this.isDragging = true;
    this.sliderList.nativeElement.scrollLeft -= event.movementX;
  }

  onMousedown(event: MouseEvent) {
    this.dragging = true;
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (this.el.nativeElement.contains(event.target)) {
      this.dragging = false;
      this.isDragging = false;
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
